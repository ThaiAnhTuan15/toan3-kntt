import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { username, parentPin, action, payload } = body;

    if (!username || !parentPin || !action) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin yêu cầu!' }, { status: 400 });
    }
    username = username.trim().toLowerCase();
    parentPin = parentPin.trim();

    // Query student account
    const rows = await queryNeon(
      `SELECT id, username, pin, nickname, avatar, data FROM student_accounts WHERE LOWER(username) = LOWER($1) LIMIT 1;`,
      [username]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tài khoản học sinh không tồn tại!' }, { status: 404 });
    }

    const account = rows[0];
    let data = account.data || {};
    const expectedParentPin = data.parentPin || '2026';

    // Tuyệt đối không cho dùng mật khẩu của bé
    if (parentPin === account.pin && account.pin !== expectedParentPin) {
      return NextResponse.json({ success: false, error: 'Không thể dùng mật khẩu của bé để thực hiện tác vụ của Cha Mẹ!' }, { status: 401 });
    }

    // Verify parent PIN
    if (parentPin !== expectedParentPin) {
      return NextResponse.json({ success: false, error: 'Mã PIN phụ huynh không đúng!' }, { status: 401 });
    }
    let msg = 'Thao tác thành công!';

    switch (action) {
      // 1. Approve withdrawal request from child
      case 'approve_withdrawal': {
        const { requestId, actualAmount, note } = payload || {};
        const requests = Array.isArray(data.piggyRequests) ? [...data.piggyRequests] : [];
        const reqIdx = requests.findIndex((r: any) => String(r.id) === String(requestId));
        if (reqIdx === -1) {
          return NextResponse.json({ success: false, error: 'Không tìm thấy yêu cầu đổi quà!' }, { status: 404 });
        }

        const amt = Number(actualAmount || requests[reqIdx].amount || 0);
        const curBal = Number(data.piggyBalance || 0);
        data.piggyBalance = Math.max(0, curBal - amt);

        requests[reqIdx] = {
          ...requests[reqIdx],
          status: 'approved',
          approvedAt: new Date().toISOString(),
          adminNote: note || 'Ba mẹ đã trao quà / tiền mặt cho con'
        };
        data.piggyRequests = requests;

        const history = Array.isArray(data.piggyHistory) ? [...data.piggyHistory] : [];
        history.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          title: 'Đã Lĩnh Thưởng (Ba Mẹ Trao Quà)',
          amount: amt,
          type: 'withdraw',
          note: note || requests[reqIdx].note || 'Ba mẹ đã trao quà cho con'
        });
        data.piggyHistory = history;
        msg = `Đã duyệt trao quà ${amt.toLocaleString('vi-VN')} đ cho bé thành công!`;
        break;
      }

      // 2. Reject withdrawal request
      case 'reject_withdrawal': {
        const { requestId, reason } = payload || {};
        const requests = Array.isArray(data.piggyRequests) ? [...data.piggyRequests] : [];
        const reqIdx = requests.findIndex((r: any) => String(r.id) === String(requestId));
        if (reqIdx !== -1) {
          requests[reqIdx] = {
            ...requests[reqIdx],
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectReason: reason || 'Nhắc con tiếp tục tiết kiệm thêm nhé'
          };
          data.piggyRequests = requests;
        }
        msg = 'Đã từ chối yêu cầu đổi quà.';
        break;
      }

      // 3. Manual Bonus Piggy reward from parent
      case 'bonus_piggy': {
        const amt = Number(payload?.amount || 0);
        if (isNaN(amt) || amt <= 0) {
          return NextResponse.json({ success: false, error: 'Số tiền thưởng phải lớn hơn 0!' }, { status: 400 });
        }
        const curBal = Number(data.piggyBalance || 0);
        data.piggyBalance = curBal + amt;

        const history = Array.isArray(data.piggyHistory) ? [...data.piggyHistory] : [];
        history.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          title: 'Ba Mẹ Thưởng Nóng Khích Lệ 🎁',
          amount: amt,
          type: 'earn',
          note: payload?.note || 'Ba mẹ khen ngợi con chăm ngoan, học giỏi!'
        });
        data.piggyHistory = history;
        msg = `Đã thưởng nóng +${amt.toLocaleString('vi-VN')} đ vào Heo đất cho con!`;
        break;
      }

      // 4. Verify Question Error reported by student -> reward +5.000d & exempt question
      case 'verify_error': {
        const { reportId, rewardAmount, adminNote } = payload || {};
        const reports = Array.isArray(data.reportedQuestions) ? [...data.reportedQuestions] : [];
        const repIdx = reports.findIndex((r: any) => String(r.id) === String(reportId));
        if (repIdx === -1) {
          return NextResponse.json({ success: false, error: 'Không tìm thấy câu hỏi báo lỗi!' }, { status: 404 });
        }

        const bonus = Number(rewardAmount || 5000);
        const report = reports[repIdx];
        reports[repIdx] = {
          ...report,
          status: 'verified',
          verifiedAt: new Date().toISOString(),
          adminNote: adminNote || 'Ba mẹ xác nhận câu hỏi bị lỗi'
        };
        data.reportedQuestions = reports;

        // Add to verified error list
        const verifiedIds = Array.isArray(data.verifiedErrorIds) ? [...data.verifiedErrorIds] : [];
        if (report.questionId && !verifiedIds.includes(report.questionId)) {
          verifiedIds.push(report.questionId);
        }
        data.verifiedErrorIds = verifiedIds;

        // Add reward money
        data.piggyBalance = Number(data.piggyBalance || 0) + bonus;
        const history = Array.isArray(data.piggyHistory) ? [...data.piggyHistory] : [];
        history.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          title: 'Thưởng Phát Hiện Câu Lỗi 🎖️',
          amount: bonus,
          type: 'earn',
          note: `Công phát hiện câu hỏi lỗi: ${report.question?.question ? String(report.question.question).slice(0, 50) + '...' : ''}`
        });
        data.piggyHistory = history;
        msg = `Đã xác nhận câu lỗi và cộng thưởng +${bonus.toLocaleString('vi-VN')} đ vào Heo đất cho con!`;
        break;
      }

      // 5. Change student 4-digit PIN
      case 'change_pin': {
        const newPin = String(payload?.newPin || '').trim();
        if (!/^\d{4}$/.test(newPin)) {
          return NextResponse.json({ success: false, error: 'Mật khẩu mới của con phải là đúng 4 chữ số!' }, { status: 400 });
        }
        await queryNeon(
          `UPDATE student_accounts SET pin = $2, updated_at = NOW() WHERE id = $1;`,
          [account.id, newPin]
        );
        msg = `Đã đổi mật khẩu của bé thành: ${newPin}`;
        return NextResponse.json({ success: true, message: msg, newPin });
      }

      // 6. Change parent 4-digit PIN
      case 'change_parent_pin': {
        const newParentPin = String(payload?.newParentPin || '').trim();
        if (!/^\d{4}$/.test(newParentPin)) {
          return NextResponse.json({ success: false, error: 'Mã PIN Ba Mẹ phải có đúng 4 chữ số!' }, { status: 400 });
        }
        if (newParentPin === account.pin) {
          return NextResponse.json({ success: false, error: 'Mã PIN Ba Mẹ không được trùng với mật khẩu của bé!' }, { status: 400 });
        }
        data.parentPin = newParentPin;
        msg = 'Đã đổi mã PIN Ba Mẹ thành công!';
        break;
      }

            // 7. Reset all learning & quiz progress to clean state
      case 'reset_student_data': {
        const nextVersion = (data.resetVersion || 1) + 1;
        data = {
          ...data,
          resetVersion: nextVersion,
          g4MathProgress: { "1": { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
          g4TvProgress: { "1": { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
          history: [],
          wrongG4Math: [],
          wrongG4Tv: [],
          badges: [],
          streakData: { currentStreak: 1, lastDate: new Date().toISOString().split('T')[0] },
          coins: 50,
          piggyBalance: 0,
          piggyHistory: [],
          piggyRequests: [],
          claimedStages: [],
          claimedFinal: false,
          reportedQuestions: [],
          verifiedErrorIds: []
        };
        msg = 'Đã đặt lại toàn bộ tiến trình học, điểm số, câu sai và heo đất về mặc định ban đầu!';
        break;
      }

      default:
        return NextResponse.json({ success: false, error: 'Hành động không hợp lệ!' }, { status: 400 });
    }

    // Save updated data
    await queryNeon(
      `UPDATE student_accounts SET data = $2::jsonb, updated_at = NOW() WHERE id = $1;`,
      [account.id, JSON.stringify(data)]
    );

    return NextResponse.json({
      success: true,
      message: msg,
      data: data
    });

  } catch (error: any) {
    console.error('Parent Action API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi xử lý yêu cầu quản trị!'
    }, { status: 500 });
  }
}
