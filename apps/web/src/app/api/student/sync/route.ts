import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

// Helper to merge progress objects (never downgrade score, stars, or unlock status, EXCEPT for reset weeks)
function mergeProgressStore(curProg: any = {}, inProg: any = {}, ignoredWeeks: number[] = []) {
  const result: Record<string, any> = { ...curProg };
  for (const [key, inVal] of Object.entries(inProg || {})) {
    const weekNum = Number(key);
    // If this week is reset on server and client is stale, enforce server's reset state!
    if (ignoredWeeks.includes(weekNum)) {
      continue;
    }
    if (!result[key]) {
      result[key] = inVal;
    } else {
      const curVal = result[key];
      const inObj = inVal as any;
      result[key] = {
        ...curVal,
        bestScore: Math.max(curVal?.bestScore || 0, inObj?.bestScore || 0),
        stars: Math.max(curVal?.stars || 0, inObj?.stars || 0),
        attempts: Math.max(curVal?.attempts || 0, inObj?.attempts || 0),
        unlocked: Boolean(curVal?.unlocked || inObj?.unlocked),
        lastCompletedAt: inObj?.lastCompletedAt || curVal?.lastCompletedAt || new Date().toISOString()
      };
    }
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, username, pin, data } = body;

    if (!accountId || !username || !pin) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin xác thực tài khoản!' }, { status: 400 });
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Dữ liệu đồng bộ không hợp lệ!' }, { status: 400 });
    }

    // Verify account exists and PIN matches
    let rows = await queryNeon(
      `SELECT id, pin, data FROM student_accounts WHERE id = $1 AND LOWER(username) = LOWER($2) LIMIT 1;`,
      [accountId, username.trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tài khoản không tồn tại!' }, { status: 404 });
    }

    if (rows[0].pin !== pin.trim()) {
      return NextResponse.json({ success: false, error: 'Mật khẩu xác thực không đúng!' }, { status: 401 });
    }

    // Current data in Neon DB
    const curData = rows[0].data || {};
    const inData = data || {};

    const serverResetTs = Number(curData.lastResetTs || curData.stage3ResetTs || 0);
    const clientResetTs = Number(inData.lastResetTs || 0);
    const isClientStale = serverResetTs > clientResetTs;

    // Stage 3 weeks (24 to 36)
    const STAGE_3_WEEKS = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
    const ignoredWeeks = isClientStale ? STAGE_3_WEEKS : [];

    // 1. Merge History: Never lose completed quizzes, but reject stale Chặng 3 history
    const histMap = new Map<string, any>();
    const existingHist = Array.isArray(curData.history) ? curData.history : [];
    const incomingHist = Array.isArray(inData.history) ? inData.history : [];

    existingHist.forEach((item: any) => {
      const key = String(item.id || `${item.date}_${item.week}`);
      histMap.set(key, item);
    });

    incomingHist.forEach((item: any) => {
      const wk = Number(item.week || item.quiz_id);
      if (isClientStale && ignoredWeeks.includes(wk)) {
        return; // Stale history from client for reset week, reject!
      }
      const key = String(item.id || `${item.date}_${item.week}`);
      if (!histMap.has(key)) {
        histMap.set(key, item);
      } else {
        // Keep the one with higher score or more details
        const existing = histMap.get(key);
        if ((item.score || 0) >= (existing.score || 0)) {
          histMap.set(key, { ...existing, ...item });
        }
      }
    });

    const mergedHistory = Array.from(histMap.values()).sort(
      (a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );

    // 2. Merge Progress Stores for each grade & subject
    const mergedG4MathProg = mergeProgressStore(curData.g4MathProgress, inData.g4MathProgress, ignoredWeeks);
    const mergedG4TvProg = mergeProgressStore(curData.g4TvProgress, inData.g4TvProgress);
    const mergedG7MathProg = mergeProgressStore(curData.g7MathProgress, inData.g7MathProgress);
    const mergedG7LitProg = mergeProgressStore(curData.g7LitProgress, inData.g7LitProgress);

    // 3. Merge Piggy Bank & Coins
    const curPiggy = typeof curData.piggyBalance === 'number' ? curData.piggyBalance : 0;
    const inPiggy = typeof inData.piggyBalance === 'number' ? inData.piggyBalance : 0;

    let mergedPiggyBalance = curPiggy;
    let mergedPiggyHistory: any[] = [];
    let mergedPiggyRequests: any[] = [];

    // If server has piggyBalance = 0 (reset) and client is stale, enforce 0
    if (isClientStale && curPiggy === 0 && inPiggy > 0) {
      mergedPiggyBalance = 0;
      mergedPiggyHistory = [];
      mergedPiggyRequests = [];
    } else {
      // Check if parent approved any withdrawal requests that incoming client still considers pending
      const clientReqMap = new Map((inData.piggyRequests || []).map((r: any) => [String(r.id), r.status]));
      let unreflectedWithdrawals = 0;
      (curData.piggyRequests || []).forEach((cr: any) => {
        if (cr.status === 'approved' && clientReqMap.get(String(cr.id)) === 'pending') {
          unreflectedWithdrawals += Number(cr.amount || 0);
        }
      });

      mergedPiggyBalance = typeof inData.piggyBalance === 'number' ? inData.piggyBalance : curPiggy;
      if (unreflectedWithdrawals > 0) {
        mergedPiggyBalance = Math.max(0, mergedPiggyBalance - unreflectedWithdrawals);
      } else if (curPiggy < inPiggy) {
        const serverWithdrawCount = (curData.piggyHistory || []).filter((h: any) => h.type === 'withdraw').length;
        const clientWithdrawCount = (inData.piggyHistory || []).filter((h: any) => h.type === 'withdraw').length;
        if (serverWithdrawCount > clientWithdrawCount) {
          mergedPiggyBalance = curPiggy;
        }
      } else if (inPiggy === 0 && curPiggy > 0) {
        mergedPiggyBalance = curPiggy;
      }

      // Merge Piggy History
      const piggyHistMap = new Map<string, any>();
      (Array.isArray(curData.piggyHistory) ? curData.piggyHistory : []).forEach((item: any) => {
        piggyHistMap.set(String(item.id || `${item.date}_${item.title}`), item);
      });
      (Array.isArray(inData.piggyHistory) ? inData.piggyHistory : []).forEach((item: any) => {
        const key = String(item.id || `${item.date}_${item.title}`);
        if (!piggyHistMap.has(key)) piggyHistMap.set(key, item);
      });
      mergedPiggyHistory = Array.from(piggyHistMap.values()).sort(
        (a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );

      // Merge Piggy Requests
      const reqMap = new Map<string, any>();
      (Array.isArray(curData.piggyRequests) ? curData.piggyRequests : []).forEach((r: any) => {
        reqMap.set(String(r.id), r);
      });
      (Array.isArray(inData.piggyRequests) ? inData.piggyRequests : []).forEach((r: any) => {
        const curReq = reqMap.get(String(r.id));
        if (!curReq || curReq.status === 'pending') {
          reqMap.set(String(r.id), r);
        }
      });
      mergedPiggyRequests = Array.from(reqMap.values()).sort(
        (a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
    }

    const curCoins = typeof curData.coins === 'number' ? curData.coins : 50;
    const inCoins = typeof inData.coins === 'number' ? inData.coins : 50;
    const mergedCoins = typeof inData.coins === 'number' ? inData.coins : curCoins;

    // 6. Merge Claimed Stages & Final (Remove stage 3 if reset)
    const curStages = Array.isArray(curData.claimedStages) ? curData.claimedStages : [];
    const inStages = Array.isArray(inData.claimedStages) ? inData.claimedStages : [];
    const rawClaimedStages = Array.from(new Set([...curStages, ...inStages]));
    const mergedClaimedStages = isClientStale 
      ? rawClaimedStages.filter((s: number) => s !== 3)
      : rawClaimedStages;
    const mergedClaimedFinal = Boolean(curData.claimedFinal || inData.claimedFinal);

    // 7. Merge Badges
    const curBadges = Array.isArray(curData.badges) ? curData.badges : [];
    const inBadges = Array.isArray(inData.badges) ? inData.badges : [];
    const mergedBadges = Array.from(new Set([...curBadges, ...inBadges]));

    // 8. Merge Reported Questions & Verified Errors
    const repMap = new Map<string, any>();
    (Array.isArray(curData.reportedQuestions) ? curData.reportedQuestions : []).forEach((q: any) => {
      repMap.set(String(q.id || q.questionId), q);
    });
    (Array.isArray(inData.reportedQuestions) ? inData.reportedQuestions : []).forEach((q: any) => {
      const curRep = repMap.get(String(q.id || q.questionId));
      if (!curRep || curRep.status === 'pending') {
        repMap.set(String(q.id || q.questionId), q);
      }
    });
    const mergedReportedQuestions = Array.from(repMap.values());

    const curVerified = Array.isArray(curData.verifiedErrorIds) ? curData.verifiedErrorIds : [];
    const inVerified = Array.isArray(inData.verifiedErrorIds) ? inData.verifiedErrorIds : [];
    const mergedVerifiedErrorIds = Array.from(new Set([...curVerified, ...inVerified]));

    // 9. Streak Data
    const curStreak = curData.streakData?.currentStreak || 1;
    const inStreak = inData.streakData?.currentStreak || 1;
    const mergedStreakData = {
      currentStreak: Math.max(curStreak, inStreak),
      lastDate: inData.streakData?.lastDate || curData.streakData?.lastDate || new Date().toISOString().split('T')[0]
    };

    // 10. Merge Wrong Question Attempts (5-attempt unlock mechanism)
    const curWrongAttempts = (curData.wrongQuestionAttempts && typeof curData.wrongQuestionAttempts === 'object') ? curData.wrongQuestionAttempts : {};
    const inWrongAttempts = (inData.wrongQuestionAttempts && typeof inData.wrongQuestionAttempts === 'object') ? inData.wrongQuestionAttempts : {};
    const mergedWrongQuestionAttempts = { ...curWrongAttempts, ...inWrongAttempts };

    // Combine all merged data (Preserve reset timestamps!)
    const activeResetTs = Math.max(serverResetTs, clientResetTs, Date.now());
    const mergedData = {
      ...curData,
      parentPin: inData.parentPin || curData.parentPin || '2026',
      currentGrade: inData.currentGrade || curData.currentGrade || '4',
      currentSubject: inData.currentSubject || curData.currentSubject || 'math',
      g4MathProgress: mergedG4MathProg,
      g4TvProgress: mergedG4TvProg,
      g7MathProgress: mergedG7MathProg,
      g7LitProgress: mergedG7LitProg,
      history: mergedHistory,
      wrongG4Math: inData.wrongG4Math || curData.wrongG4Math || [],
      wrongG4Tv: inData.wrongG4Tv || curData.wrongG4Tv || [],
      wrongG7Math: inData.wrongG7Math || curData.wrongG7Math || [],
      wrongG7Lit: inData.wrongG7Lit || curData.wrongG7Lit || [],
      wrongQuestionAttempts: mergedWrongQuestionAttempts,
      badges: mergedBadges,
      streakData: mergedStreakData,
      coins: mergedCoins,
      piggyBalance: mergedPiggyBalance,
      piggyHistory: mergedPiggyHistory,
      piggyRequests: mergedPiggyRequests,
      claimedStages: mergedClaimedStages,
      claimedFinal: mergedClaimedFinal,
      reportedQuestions: mergedReportedQuestions,
      verifiedErrorIds: mergedVerifiedErrorIds,
      lastResetTs: activeResetTs,
      stage3ResetTs: curData.stage3ResetTs || activeResetTs
    };

    // Save merged data to Neon DB
    await queryNeon(
      `UPDATE student_accounts
       SET data = $2::jsonb, updated_at = NOW()
       WHERE id = $1;`,
      [accountId, JSON.stringify(mergedData)]
    );

    return NextResponse.json({
      success: true,
      message: 'Đồng bộ dữ liệu đám mây thành công!',
      syncedAt: new Date().toISOString(),
      data: mergedData
    });

  } catch (error: any) {
    console.error('Sync API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi đồng bộ dữ liệu!'
    }, { status: 500 });
  }
}
