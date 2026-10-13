'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import sounds from '../utils/soundEffects';

// Grade 4 Data
import { STAGES, TOPIC_CATEGORIES, WEEKS_METADATA, QUESTION_BANK, getQuestionsByWeek, getFilteredQuestions } from '../data/questionBank';
import { STAGES_TV, TOPIC_CATEGORIES_TV, WEEKS_METADATA_TV, QUESTION_BANK_TV, getQuestionsByWeekTV, getFilteredQuestionsTV } from '../data/tiengviet/questionBankTV';

// Grade 7 Data
import { STAGES_MATH7, TOPIC_CATEGORIES_MATH7, WEEKS_METADATA_MATH7, QUESTION_BANK_MATH7, getQuestionsByWeekMath7, getFilteredQuestionsMath7 } from '../data/grade7/math/questionBankMath7';
import { STAGES_LIT7, TOPIC_CATEGORIES_LIT7, WEEKS_METADATA_LIT7, QUESTION_BANK_LIT7, getQuestionsByWeekLit7, getFilteredQuestionsLit7 } from '../data/grade7/literature/questionBankLit7';

const LearningContext = createContext();

const getStorageKeys = (profileId) => ({
  GRADE: `agy_grade_${profileId}`,
  SUBJECT: `agy_subject_${profileId}`,
  PROFILE: `agy_profile_${profileId}`,
  PROGRESS_G4_MATH: `agy_prog_g4m_${profileId}`,
  PROGRESS_G4_TV: `agy_prog_g4tv_${profileId}`,
  PROGRESS_G7_MATH: `agy_prog_g7m_${profileId}`,
  PROGRESS_G7_LIT: `agy_prog_g7lit_${profileId}`,
  HISTORY: `agy_history_${profileId}`,
  WRONG_G4_MATH: `agy_wrong_g4m_${profileId}`,
  WRONG_G4_TV: `agy_wrong_g4tv_${profileId}`,
  WRONG_G7_MATH: `agy_wrong_g7m_${profileId}`,
  WRONG_G7_LIT: `agy_wrong_g7lit_${profileId}`,
  BADGES: `agy_badges_${profileId}`,
  STREAK: `agy_streak_${profileId}`,
  FREE_MODE: `agy_freemode_${profileId}`,
  COINS: `agy_coins_${profileId}`,
  PARENT_PIN: `agy_parentpin_${profileId}`,
  PIGGY_BANK: `agy_piggy_${profileId}`,
  PIGGY_HISTORY: `agy_piggy_hist_${profileId}`,
  PIGGY_REQUESTS: `agy_piggy_req_${profileId}`,
  CLAIMED_STAGES: `agy_piggy_stages_${profileId}`,
  CLAIMED_FINAL: `agy_piggy_final_${profileId}`,
  REPORTED_QUESTIONS: `agy_reported_q_${profileId}`,
  VERIFIED_ERROR_IDS: `agy_verified_err_${profileId}`
});

const DEFAULT_PROFILE = {
  name: 'Bé Bi',
  avatar: '🐯',
  mascot: '🐯',
  avatarColor: '#FFD166',
};

export const BADGE_DEFINITIONS = [
  { id: 'first_quiz', name: 'Bước Chân Đầu Tiên', desc: 'Hoàn thành bài luyện tập đầu tiên', icon: 'Footprints', req: (h) => h.length >= 1 },
  { id: 'perfect_10', name: 'Điểm 10 Hoàn Hảo', desc: 'Đạt điểm tối đa 100% trong 1 bài thi', icon: 'Award', req: (h) => h.some(q => q.score === 100) },
  { id: 'g4_math_master', name: 'Hiệp Sĩ Toán Lớp 4', desc: 'Hoàn thành trên 15 tuần Toán 4', icon: 'ShieldCheck', req: (h, p) => Object.keys(p.g4Math || {}).filter(w => p.g4Math[w]?.bestScore >= 70).length >= 15 },
  { id: 'g4_tv_master', name: 'Trạng Nguyên Tiếng Việt 4', desc: 'Hoàn thành trên 15 tuần Tiếng Việt 4', icon: 'BookOpen', req: (h, p) => Object.keys(p.g4Tv || {}).filter(w => p.g4Tv[w]?.bestScore >= 70).length >= 15 },
  { id: 'g7_math_master', name: 'Thần Đồng Toán Lớp 7', desc: 'Hoàn thành trên 15 tuần Toán 7', icon: 'Zap', req: (h, p) => Object.keys(p.g7Math || {}).filter(w => p.g7Math[w]?.bestScore >= 70).length >= 15 },
  { id: 'g7_lit_master', name: 'Nhà Văn Nhí Lớp 7', desc: 'Hoàn thành trên 15 tuần Ngữ Văn 7', icon: 'Feather', req: (h, p) => Object.keys(p.g7Lit || {}).filter(w => p.g7Lit[w]?.bestScore >= 70).length >= 15 },
  { id: 'streak_3', name: 'Chăm Chỉ Chuyên Cần', desc: 'Học liên tục trong 3 ngày', icon: 'Flame', req: (h, p, s) => (s?.currentStreak || 1) >= 3 },
  { id: 'star_hunter_30', name: 'Thợ Săn Ngôi Sao', desc: 'Tích lũy được trên 30 ngôi sao', icon: 'Star', req: (h, p, s, stars) => stars >= 30 }
];

export const LearningProvider = ({ children, profileId = 'default', account = null, onUpdateAccount = null }) => {
  const STORAGE_KEYS = getStorageKeys(profileId);

  // Helper: Read from LocalStorage -> fallback to account cloud data -> default
  const getInitialVal = (storageKey, cloudProp, defaultVal) => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null && saved !== undefined) return JSON.parse(saved);
    } catch (e) {}
    if (account?.data && account.data[cloudProp] !== undefined) {
      return account.data[cloudProp];
    }
    return defaultVal;
  };

  // Current active Grade: '4' | '7'
  const [currentGrade, setCurrentGrade] = useState(() => {
    return getInitialVal(STORAGE_KEYS.GRADE, 'currentGrade', '4');
  });

  // Current active Subject: 'math' | 'vietnamese'
  const [currentSubject, setCurrentSubject] = useState(() => {
    return getInitialVal(STORAGE_KEYS.SUBJECT, 'currentSubject', 'math');
  });

  const [profile, setProfile] = useState(() => {
    if (account) {
      return {
        name: account.nickname || account.username || 'Học Sinh',
        avatar: account.avatar || '🐯',
        mascot: account.avatar || '🐯',
        avatarColor: '#FFD166',
        username: account.username,
        pin: account.pin
      };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      let parsed = saved ? JSON.parse(saved) : null;

      // Check agy_profiles list
      let itemInList = null;
      try {
        const rawList = localStorage.getItem('agy_profiles');
        const list = rawList ? JSON.parse(rawList) : [];
        itemInList = list.find(p => p.id === profileId);
      } catch (e) {}

      // Check activeProfileData
      let activeData = null;
      try {
        const rawActive = localStorage.getItem('activeProfileData');
        if (rawActive) {
          const a = JSON.parse(rawActive);
          if (a.id === profileId) activeData = a;
        }
      } catch (e) {}

      const bestSource = activeData || itemInList;

      if (parsed) {
        if (bestSource) {
          if (!parsed.avatar || parsed.name === 'Học Sinh Chăm Chỉ') {
            parsed.name = bestSource.name || parsed.name;
            parsed.avatar = bestSource.avatar || parsed.avatar || '🐯';
            parsed.mascot = bestSource.avatar || parsed.mascot || '🐯';
          }
        } else if (!parsed.avatar) {
          parsed.avatar = '🐯';
        }
        return parsed;
      }

      if (bestSource) {
        return {
          name: bestSource.name,
          avatar: bestSource.avatar || '🐯',
          mascot: bestSource.avatar || '🐯',
          avatarColor: '#FFD166'
        };
      }

      return profileId === 'default'
        ? { name: 'Bé Bi', avatar: '🐯', mascot: '🐯', avatarColor: '#FFD166' }
        : { name: 'Học Sinh', avatar: '🐯', mascot: '🐯', avatarColor: '#FFD166' };
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Progress Stores
  const [g4MathProgress, setG4MathProgress] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PROGRESS_G4_MATH, 'g4MathProgress', { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } });
  });

  const [g4TvProgress, setG4TvProgress] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PROGRESS_G4_TV, 'g4TvProgress', { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } });
  });

  const [g7MathProgress, setG7MathProgress] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PROGRESS_G7_MATH, 'g7MathProgress', { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } });
  });

  const [g7LitProgress, setG7LitProgress] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PROGRESS_G7_LIT, 'g7LitProgress', { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } });
  });

  // Quiz History
  const [history, setHistory] = useState(() => {
    return getInitialVal(STORAGE_KEYS.HISTORY, 'history', []);
  });

  // Wrong Questions Stores
  const [g4MathWrong, setG4MathWrong] = useState(() => {
    return getInitialVal(STORAGE_KEYS.WRONG_G4_MATH, 'wrongG4Math', []);
  });

  const [g4TvWrong, setG4TvWrong] = useState(() => {
    return getInitialVal(STORAGE_KEYS.WRONG_G4_TV, 'wrongG4Tv', []);
  });

  const [g7MathWrong, setG7MathWrong] = useState(() => {
    return getInitialVal(STORAGE_KEYS.WRONG_G7_MATH, 'wrongG7Math', []);
  });

  const [g7LitWrong, setG7LitWrong] = useState(() => {
    return getInitialVal(STORAGE_KEYS.WRONG_G7_LIT, 'wrongG7Lit', []);
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    return getInitialVal(STORAGE_KEYS.BADGES, 'badges', []);
  });

  const [streakData, setStreakData] = useState(() => {
    return getInitialVal(STORAGE_KEYS.STREAK, 'streakData', { currentStreak: 1, lastDate: new Date().toISOString().split('T')[0] });
  });

  const [isFreeMode, setIsFreeMode] = useState(() => {
    return getInitialVal(STORAGE_KEYS.FREE_MODE, 'isFreeMode', false);
  });

  const [coins, setCoins] = useState(() => {
    return getInitialVal(STORAGE_KEYS.COINS, 'coins', 50);
  });

  const [parentPin, setParentPin] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PARENT_PIN, 'parentPin', '2026');
  });

  const updateParentPin = (newPin) => {
    setParentPin(newPin);
    sounds.playClick();
  };

  // Piggy Bank (Heo Đất Tri Thức)
  const [piggyBalance, setPiggyBalance] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PIGGY_BANK, 'piggyBalance', 0);
  });

  const [piggyHistory, setPiggyHistory] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PIGGY_HISTORY, 'piggyHistory', []);
  });

  const [piggyRequests, setPiggyRequests] = useState(() => {
    return getInitialVal(STORAGE_KEYS.PIGGY_REQUESTS, 'piggyRequests', []);
  });

  const [claimedStages, setClaimedStages] = useState(() => {
    return getInitialVal(STORAGE_KEYS.CLAIMED_STAGES, 'claimedStages', []);
  });

  const [claimedFinal, setClaimedFinal] = useState(() => {
    return getInitialVal(STORAGE_KEYS.CLAIMED_FINAL, 'claimedFinal', false);
  });

  // Request withdrawal from student
  const requestWithdrawal = (amount, note) => {
    const num = Number(amount);
    if (!num || num <= 0) return { success: false, message: 'Số tiền phải lớn hơn 0!' };
    if (num > piggyBalance) return { success: false, message: 'Số tiền yêu cầu vượt quá số dư trong Heo đất!' };
    
    const newReq = {
      id: 'req_' + Date.now(),
      date: new Date().toISOString(),
      amount: num,
      note: note || 'Mua đồ dùng học tập',
      status: 'pending'
    };
    setPiggyRequests(prev => [newReq, ...prev]);
    sounds.playVictory();
    return { success: true, message: 'Đã gửi yêu cầu tới Ba Mẹ thành công!' };
  };

  // Approve withdrawal from parent
  const approveWithdrawal = (requestId, customAmount, note) => {
    const req = piggyRequests.find(r => r.id === requestId);
    if (!req) return;
    const actualAmount = customAmount ? Number(customAmount) : req.amount;
    
    setPiggyBalance(prev => Math.max(0, prev - actualAmount));
    setPiggyRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved', approvedAt: new Date().toISOString() } : r));
    
    const trans = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: 'Đã Lĩnh Thưởng (Ba Mẹ Trao Quà)',
      amount: actualAmount,
      type: 'withdraw',
      note: note || req.note || 'Ba mẹ đã trao quà / tiền mặt cho con'
    };
    setPiggyHistory(prev => [trans, ...prev]);
    sounds.playVictory();
  };

  // Reject withdrawal
  const rejectWithdrawal = (requestId, reason) => {
    setPiggyRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectReason: reason || 'Nhắc con tiếp tục tiết kiệm thêm nhé' } : r));
    sounds.playClick();
  };

  // Direct manual adjustment by parent
  const manualAdjustPiggy = (amount, reason) => {
    const num = Number(amount);
    if (isNaN(num) || num === 0) return;
    setPiggyBalance(prev => Math.max(0, prev + num));
    const trans = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: num > 0 ? 'Ba Mẹ Thưởng Nóng' : 'Ba Mẹ Điều Chỉnh Số Dư',
      amount: Math.abs(num),
      type: num > 0 ? 'earn' : 'withdraw',
      note: reason || 'Điều chỉnh từ phụ huynh'
    };
    setPiggyHistory(prev => [trans, ...prev]);
    sounds.playClick();
  };

  // Reported Questions & Error Verification
  const [reportedQuestions, setReportedQuestions] = useState(() => {
    return getInitialVal(STORAGE_KEYS.REPORTED_QUESTIONS, 'reportedQuestions', []);
  });

  const [verifiedErrorIds, setVerifiedErrorIds] = useState(() => {
    return getInitialVal(STORAGE_KEYS.VERIFIED_ERROR_IDS, 'verifiedErrorIds', []);
  });

  // Report Question Error from student
  const reportQuestionError = (question, week, reason, note) => {
    if (!question || !question.id) return { success: false, message: 'Thiếu thông tin câu hỏi!' };
    
    // Check if already reported and pending
    const existing = reportedQuestions.find(r => r.questionId === question.id && r.status === 'pending');
    if (existing) {
      return { success: false, message: 'Câu hỏi này con đã gửi báo lỗi tới Ba Mẹ rồi nhé!' };
    }

    const newReport = {
      id: 'err_' + Date.now(),
      questionId: question.id,
      week: week || null,
      question: {
        id: question.id,
        question: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        hint: question.hint,
        image: question.image,
        topic: question.topic || question.category,
        difficulty: question.difficulty
      },
      reason: reason || 'Bé nghi ngờ câu hỏi bị lỗi',
      note: note || '',
      reportedAt: new Date().toISOString(),
      status: 'pending', // 'pending' | 'verified' | 'rejected'
      adminNote: '',
      verifiedAt: null
    };

    setReportedQuestions(prev => [newReport, ...prev]);
    sounds.playVictory();
    return { 
      success: true, 
      message: 'Đã gửi báo lỗi tới Ba Mẹ thành công! Khi Ba Mẹ xác nhận đúng là câu lỗi, con sẽ nhận +5.000 đ thưởng Heo Đất nhé! 🎖️' 
    };
  };

  // Verify Question Error by parent -> reward +5.000d & exempt from wrong lists
  const verifyQuestionError = (reportId, customReward = 5000) => {
    const report = reportedQuestions.find(r => r.id === reportId);
    if (!report) return;

    const qId = report.questionId;
    const rewardAmt = Number(customReward) || 5000;

    // Update report status
    setReportedQuestions(prev => prev.map(r => r.id === reportId ? {
      ...r,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      rewardAmount: rewardAmt
    } : r));

    // Add to verified error IDs
    if (!verifiedErrorIds.includes(qId)) {
      setVerifiedErrorIds(prev => [...prev, qId]);
    }

    // Reward child +5.000d into Piggy Bank
    setPiggyBalance(prev => prev + rewardAmt);
    const trans = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: 'Thưởng Phát Hiện Câu Lỗi 🔍',
      amount: rewardAmt,
      type: 'earn',
      note: `Ba Mẹ xác nhận câu (${qId}) bị lỗi. Thưởng nóng bé ${rewardAmt.toLocaleString('vi-VN')} đ!`
    };
    setPiggyHistory(prev => [trans, ...prev]);

    // Remove this question from wrong questions lists so child is not marked wrong
    const removeFromList = (list) => list.filter(q => q.id !== qId);
    setG4MathWrong(removeFromList);
    setG4TvWrong(removeFromList);
    setG7MathWrong(removeFromList);
    setG7LitWrong(removeFromList);

    sounds.playVictory();
  };

  // Reject Question Error by parent
  const rejectQuestionError = (reportId, adminNote) => {
    setReportedQuestions(prev => prev.map(r => r.id === reportId ? {
      ...r,
      status: 'rejected',
      adminNote: adminNote || 'Câu hỏi này chính xác, con đọc kỹ lại gợi ý và lời giải nhé!'
    } : r));
    sounds.playClick();
  };

  // Undo verification by parent
  const unverifyQuestionError = (reportId) => {
    const report = reportedQuestions.find(r => r.id === reportId);
    if (!report) return;
    const qId = report.questionId;
    setReportedQuestions(prev => prev.map(r => r.id === reportId ? { ...r, status: 'pending', verifiedAt: null } : r));
    setVerifiedErrorIds(prev => prev.filter(id => id !== qId));
    sounds.playClick();
  };

  const [soundEnabled, setSoundEnabled] = useState(sounds.isSoundEnabled());

  const [apiQuestions, setApiQuestions] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${url}/api/questions`);
        if (res.ok) {
          const data = await res.json();
          setApiQuestions(data);
        }
      } catch (err) {
        console.error('Failed to fetch from API:', err);
      } finally {
        setIsApiLoading(false);
      }
    };
    fetchQuestions();
  }, []);


  // Save to LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GRADE, currentGrade); }, [currentGrade]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SUBJECT, currentSubject); }, [currentSubject]);
  useEffect(() => { 
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); 
    try {
      const rawList = localStorage.getItem('agy_profiles');
      if (rawList) {
        const list = JSON.parse(rawList);
        const idx = list.findIndex(p => p.id === profileId);
        if (idx !== -1) {
          const targetAvatar = profile.avatar || profile.mascot || list[idx].avatar;
          if (list[idx].name !== profile.name || list[idx].avatar !== targetAvatar) {
            list[idx].name = profile.name;
            list[idx].avatar = targetAvatar;
            localStorage.setItem('agy_profiles', JSON.stringify(list));
          }
        }
      }
    } catch (e) {}
  }, [profile]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROGRESS_G4_MATH, JSON.stringify(g4MathProgress)); }, [g4MathProgress]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROGRESS_G4_TV, JSON.stringify(g4TvProgress)); }, [g4TvProgress]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROGRESS_G7_MATH, JSON.stringify(g7MathProgress)); }, [g7MathProgress]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROGRESS_G7_LIT, JSON.stringify(g7LitProgress)); }, [g7LitProgress]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WRONG_G4_MATH, JSON.stringify(g4MathWrong)); }, [g4MathWrong]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WRONG_G4_TV, JSON.stringify(g4TvWrong)); }, [g4TvWrong]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WRONG_G7_MATH, JSON.stringify(g7MathWrong)); }, [g7MathWrong]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WRONG_G7_LIT, JSON.stringify(g7LitWrong)); }, [g7LitWrong]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(unlockedBadges)); }, [unlockedBadges]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streakData)); }, [streakData]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FREE_MODE, JSON.stringify(isFreeMode)); }, [isFreeMode]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COINS, JSON.stringify(coins)); }, [coins]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PARENT_PIN, JSON.stringify(parentPin)); }, [parentPin]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PIGGY_BANK, JSON.stringify(piggyBalance)); }, [piggyBalance]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PIGGY_HISTORY, JSON.stringify(piggyHistory)); }, [piggyHistory]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PIGGY_REQUESTS, JSON.stringify(piggyRequests)); }, [piggyRequests]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLAIMED_STAGES, JSON.stringify(claimedStages)); }, [claimedStages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLAIMED_FINAL, JSON.stringify(claimedFinal)); }, [claimedFinal]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REPORTED_QUESTIONS, JSON.stringify(reportedQuestions)); }, [reportedQuestions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VERIFIED_ERROR_IDS, JSON.stringify(verifiedErrorIds)); }, [verifiedErrorIds]);

  // Auto-sync debounced to Cloud whenever progress, coins, piggy, etc. changes
  useEffect(() => {
    if (!account || !account.username || !account.pin) return;

    const timer = setTimeout(() => {
      const fullData = {
        currentGrade,
        currentSubject,
        g4MathProgress,
        g4TvProgress,
        g7MathProgress,
        g7LitProgress,
        history,
        wrongG4Math: g4MathWrong,
        wrongG4Tv: g4TvWrong,
        wrongG7Math: g7MathWrong,
        wrongG7Lit: g7LitWrong,
        badges: unlockedBadges,
        streakData,
        coins,
        piggyBalance,
        piggyHistory,
        piggyRequests,
        claimedStages,
        claimedFinal,
        reportedQuestions,
        verifiedErrorIds
      };

      fetch('/api/student/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: account.id,
          username: account.username,
          pin: account.pin,
          data: fullData
        })
      }).catch(err => console.warn('Background auto-sync error:', err));
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    account,
    currentGrade,
    currentSubject,
    g4MathProgress,
    g4TvProgress,
    g7MathProgress,
    g7LitProgress,
    history,
    g4MathWrong,
    g4TvWrong,
    g7MathWrong,
    g7LitWrong,
    unlockedBadges,
    streakData,
    coins,
    piggyBalance,
    piggyHistory,
    piggyRequests,
    claimedStages,
    claimedFinal,
    reportedQuestions,
    verifiedErrorIds
  ]);

  // Derived active state
  const isMath = currentSubject === 'math';
  const isGrade7 = currentGrade === '7';

  // Dynamic progress selector
  const progress = isGrade7
    ? (isMath ? g7MathProgress : g7LitProgress)
    : (isMath ? g4MathProgress : g4TvProgress);

  const wrongQuestions = isGrade7
    ? (isMath ? g7MathWrong : g7LitWrong)
    : (isMath ? g4MathWrong : g4TvWrong);

  const currentBank = isGrade7
    ? (isMath ? QUESTION_BANK_MATH7 : QUESTION_BANK_LIT7)
    : (isMath ? QUESTION_BANK : QUESTION_BANK_TV);

  const currentStages = isGrade7
    ? (isMath ? STAGES_MATH7 : STAGES_LIT7)
    : (isMath ? STAGES : STAGES_TV);

  const currentCategories = isGrade7
    ? (isMath ? TOPIC_CATEGORIES_MATH7 : TOPIC_CATEGORIES_LIT7)
    : (isMath ? TOPIC_CATEGORIES : TOPIC_CATEGORIES_TV);

  const currentMetadata = isGrade7
    ? (isMath ? WEEKS_METADATA_MATH7 : WEEKS_METADATA_LIT7)
    : (isMath ? WEEKS_METADATA : WEEKS_METADATA_TV);

  
  const getQuestionsByWeekDynamic = (week) => {
    if (currentGrade !== '7' && isMath && apiQuestions.length > 0) {
      // Use API questions for Toan 3/4
      return apiQuestions.filter(q => q.week === Number(week));
    }
    // Fallback
    const fallbackFn = isGrade7
      ? (isMath ? getQuestionsByWeekMath7 : getQuestionsByWeekLit7)
      : (isMath ? getQuestionsByWeek : getQuestionsByWeekTV);
    return fallbackFn(week);
  };


  const getFilteredQuestionsDynamic = isGrade7
    ? (isMath ? getFilteredQuestionsMath7 : getFilteredQuestionsLit7)
    : (isMath ? getFilteredQuestions : getFilteredQuestionsTV);

  // Calculate stars
  const totalStars = Object.values(progress).reduce((sum, item) => sum + (item.stars || 0), 0);

  // Check streak
  const checkStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    if (streakData.lastDate === today) return;

    const last = new Date(streakData.lastDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      setStreakData(prev => ({ currentStreak: prev.currentStreak + 1, lastDate: today }));
    } else if (diffDays > 1) {
      setStreakData({ currentStreak: 1, lastDate: today });
    }
  };

  // Check badges
  const checkBadges = (newHistory, currentStars) => {
    const newlyUnlocked = [];
    const fullProgress = {
      g4Math: g4MathProgress,
      g4Tv: g4TvProgress,
      g7Math: g7MathProgress,
      g7Lit: g7LitProgress
    };
    BADGE_DEFINITIONS.forEach(b => {
      if (!unlockedBadges.includes(b.id)) {
        if (b.req(newHistory, fullProgress, streakData, currentStars)) {
          newlyUnlocked.push(b.id);
        }
      }
    });
    if (newlyUnlocked.length > 0) {
      setUnlockedBadges(prev => [...prev, ...newlyUnlocked]);
      sounds.playUnlock();
    }
  };

  // Save Quiz Result
  const saveQuizResult = (resultData) => {
    checkStreak();

    const { week, score, correctCount, totalCount, details, type, timeSpent, grade, subject } = resultData;
    const activeGrade = grade || currentGrade;
    const activeSubj = subject || currentSubject;
    const isActMath = activeSubj === 'math';
    const isActG7 = activeGrade === '7';

    // Calculate stars
    let earnedStars = 0;
    if (score >= 90) earnedStars = 3;
    else if (score >= 70) earnedStars = 2;
    else if (score >= 50) earnedStars = 1;

    // Coins
    const earnedCoins = correctCount * 5 + (score === 100 ? 30 : 10);
    setCoins(prev => prev + earnedCoins);

    // Calculate Piggy Reward Money (VNĐ)
    let earnedMoney = 0;
    const prevAttempts = (progress[week]?.attempts) || 0;
    // Miễn trừ câu hỏi lỗi đã được xác nhận để không bị phạt trừ tiền heo đất:
    const verifiedErrorsInDetails = details ? details.filter(d => !d.isCorrect && verifiedErrorIds.includes(d.question.id)).length : 0;
    const wrongCount = Math.max(0, (totalCount - correctCount) - verifiedErrorsInDetails);

    if (prevAttempts === 0) {
      // Lần 1: Đúng hết 10.000đ, sai 1 câu trừ 2.000đ, sai >= 5 câu là 0đ
      if (wrongCount < 5) {
        earnedMoney = Math.max(0, 10000 - wrongCount * 2000);
      } else {
        earnedMoney = 0;
      }
    } else if (prevAttempts === 1) {
      // Lần 2: Đúng hết 5.000đ, sai 1 câu trừ 1.000đ, sai >= 5 câu là 0đ
      if (wrongCount < 5) {
        earnedMoney = Math.max(0, 5000 - wrongCount * 1000);
      } else {
        earnedMoney = 0;
      }
    } else {
      // Lần 3 trở đi: Đúng hết (100%) thưởng 2.000đ khích lệ
      if (score === 100) {
        earnedMoney = 2000;
      } else {
        earnedMoney = 0;
      }
    }

    if (earnedMoney > 0) {
      setPiggyBalance(prev => prev + earnedMoney);
      const moneyTrans = {
        id: Date.now() + 1,
        date: new Date().toISOString(),
        title: `Làm Đề ${week} (Lần ${prevAttempts + 1})`,
        amount: earnedMoney,
        type: 'earn',
        note: `Đúng ${correctCount}/${totalCount} câu (Điểm: ${score}%)`
      };
      setPiggyHistory(prev => [moneyTrans, ...prev]);
    }

    // Check Stage completion (Thưởng Vượt Chặng: +50.000đ / chặng)
    let stageReward = null;
    let finalReward = null;

    if (currentGrade !== '7' && isMath && week) {
      const currentStageObj = STAGES.find(st => st.weeks.includes(Number(week)));
      if (currentStageObj && !claimedStages.includes(currentStageObj.id)) {
        const isStageFinished = currentStageObj.weeks.every(wNum => {
          if (wNum === Number(week)) return Math.max(progress[week]?.bestScore || 0, score) >= 75;
          return (progress[wNum]?.bestScore || 0) >= 75;
        });

        if (isStageFinished) {
          const bonusStage = 50000;
          setClaimedStages(prev => [...prev, currentStageObj.id]);
          setPiggyBalance(prev => prev + bonusStage);
          const stageTrans = {
            id: Date.now() + 2,
            date: new Date().toISOString(),
            title: `Thưởng Vượt ${currentStageObj.title.split(':')[0]}!`,
            amount: bonusStage,
            type: 'earn',
            note: `Hoàn thành toàn bộ các đề trong ${currentStageObj.title}`
          };
          setPiggyHistory(prev => [stageTrans, ...prev]);
          stageReward = { stageId: currentStageObj.id, stageTitle: currentStageObj.title, amount: bonusStage };
        }
      }

      // Check Học bổng HK1 (Hoàn thành cả 6 Chặng - 66 đề: +100.000đ)
      if (!claimedFinal) {
        const all66Finished = Array.from({ length: 66 }, (_, i) => i + 1).every(wNum => {
          if (wNum === Number(week)) return Math.max(progress[week]?.bestScore || 0, score) >= 75;
          return (progress[wNum]?.bestScore || 0) >= 75;
        });
        if (all66Finished) {
          const bonusFinal = 100000;
          setClaimedFinal(true);
          setPiggyBalance(prev => prev + bonusFinal);
          const finalTrans = {
            id: Date.now() + 3,
            date: new Date().toISOString(),
            title: 'Học Bổng Xuất Sắc Học Kỳ 1 (Toán 3)',
            amount: bonusFinal,
            type: 'earn',
            note: 'Chinh phục trọn vẹn 66 Đề học tập GDPT 2018!'
          };
          setPiggyHistory(prev => [finalTrans, ...prev]);
          finalReward = { amount: bonusFinal };
        }
      }
    }

    // Update wrong list (Tự động loại trừ các câu hỏi bị lỗi đã xác nhận)
    const updateWrongList = (prevList) => {
      const updated = [...prevList];
      details.forEach(item => {
        if (!item.isCorrect && !verifiedErrorIds.includes(item.question.id)) {
          if (!updated.some(w => w.id === item.question.id)) {
            updated.push(item.question);
          }
        } else {
          const idx = updated.findIndex(w => w.id === item.question.id);
          if (idx !== -1) updated.splice(idx, 1);
        }
      });
      return updated;
    };

    if (isActG7) {
      if (isActMath) setG7MathWrong(updateWrongList);
      else setG7LitWrong(updateWrongList);
    } else {
      if (isActMath) setG4MathWrong(updateWrongList);
      else setG4TvWrong(updateWrongList);
    }

    // Update week progress
    const updateProgressObj = (prev) => {
      const currentWeekData = prev[week] || { bestScore: 0, stars: 0, attempts: 0 };
      const newBestScore = Math.max(currentWeekData.bestScore || 0, score);
      const newStars = Math.max(currentWeekData.stars || 0, earnedStars);

      const updated = {
        ...prev,
        [week]: {
          bestScore: newBestScore,
          stars: newStars,
          attempts: (currentWeekData.attempts || 0) + 1,
          lastCompletedAt: new Date().toISOString()
        }
      };

      if (score >= 75 && week < 66) {
        const nextWeek = Number(week) + 1;
        if (!updated[nextWeek]) {
          updated[nextWeek] = { bestScore: 0, stars: 0, attempts: 0, unlocked: true };
        } else {
          updated[nextWeek].unlocked = true;
        }
      }
      return updated;
    };

    if (week) {
      if (isActG7) {
        if (isActMath) setG7MathProgress(updateProgressObj);
        else setG7LitProgress(updateProgressObj);
      } else {
        if (isActMath) setG4MathProgress(updateProgressObj);
        else setG4TvProgress(updateProgressObj);
      }
    }

    // Record History
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      grade: activeGrade,
      subject: activeSubj,
      week: week || null,
      type: type || 'practice',
      score,
      correctCount,
      totalCount,
      timeSpent: timeSpent || 0,
      earnedStars,
      earnedCoins,
      earnedMoney,
      stageReward,
      finalReward,
      details: details.map(d => ({
        questionId: d.question.id,
        category: d.question.category,
        isCorrect: d.isCorrect,
        userAnswer: d.userAnswer,
        correctAnswer: d.question.correctIndex
      }))
    };

    const newHistory = [historyItem, ...history];
    setHistory(newHistory);

    // Check Badges
    checkBadges(newHistory, totalStars + earnedStars);

    return {
      earnedStars,
      earnedCoins,
      earnedMoney,
      stageReward,
      finalReward
    };
  };

  // Toggle Free Mode
  const toggleFreeMode = () => {
    setIsFreeMode(prev => !prev);
    sounds.playClick();
  };

  // Toggle Sound FX
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  // Switch Grade (Lớp 4 <-> Lớp 7)
  const switchGrade = (grade) => {
    if (grade === '4' || grade === '7') {
      setCurrentGrade(grade);
      sounds.playClick();
    }
  };

  // Switch Subject (Toán <-> Tiếng Việt / Ngữ Văn)
  const switchSubject = (subj) => {
    if (subj === 'math' || subj === 'vietnamese') {
      setCurrentSubject(subj);
      sounds.playClick();
    }
  };

  // Check if week is unlocked
  const isWeekUnlocked = (weekNum) => {
    if (isFreeMode) return true;
    if (Number(weekNum) === 1) return true;
    if (progress[weekNum]?.unlocked) return true;
    const prevWeek = Number(weekNum) - 1;
    return (progress[prevWeek]?.bestScore || 0) >= 75;
  };

  const updateProfile = (newProfile) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        const rawList = localStorage.getItem('agy_profiles');
        if (rawList) {
          const list = JSON.parse(rawList);
          const idx = list.findIndex(p => p.id === profileId);
          if (idx !== -1) {
            list[idx].name = updated.name;
            list[idx].avatar = updated.avatar || updated.mascot || list[idx].avatar;
            localStorage.setItem('agy_profiles', JSON.stringify(list));
          }
        }
        localStorage.setItem('activeProfileData', JSON.stringify({
          id: profileId,
          name: updated.name,
          avatar: updated.avatar || updated.mascot
        }));
      } catch (e) {}

      // If logged in to Cloud Account, sync Nickname, Avatar and PIN to Cloud database
      if (account && account.username && account.pin) {
        fetch('/api/student/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: account.id,
            username: account.username,
            pin: account.pin,
            nickname: updated.name,
            avatar: updated.avatar || updated.mascot,
            newPin: newProfile.pin || undefined
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.account) {
              const updatedAccount = {
                ...account,
                nickname: data.account.nickname,
                avatar: data.account.avatar,
                pin: data.account.pin || account.pin
              };
              localStorage.setItem('agy_active_account', JSON.stringify(updatedAccount));
              if (onUpdateAccount) onUpdateAccount(updatedAccount);
            }
          })
          .catch(err => console.warn('Profile cloud update error:', err));
      }

      return updated;
    });
    sounds.playClick();
  };

  const resetProgress = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <LearningContext.Provider value={{
      resetProgress,
      currentGrade,
      switchGrade,
      isGrade7,
      currentSubject,
      switchSubject,
      isMath,
      profile,
      updateProfile,
      parentPin,
      updateParentPin,
      progress,
      totalStars,
      coins,
      piggyBalance,
      piggyHistory,
      piggyRequests,
      claimedStages,
      claimedFinal,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      manualAdjustPiggy,
      reportedQuestions,
      verifiedErrorIds,
      reportQuestionError,
      verifyQuestionError,
      rejectQuestionError,
      unverifyQuestionError,
      streakData,
      isFreeMode,
      isApiLoading,
      toggleFreeMode,
      soundEnabled,
      toggleSound,
      history,
      wrongQuestions,
      unlockedBadges,
      saveQuizResult,
      isWeekUnlocked,
      currentBank,
      currentStages,
      currentCategories,
      currentMetadata,
      getQuestionsByWeek: getQuestionsByWeekDynamic,
      getFilteredQuestions: getFilteredQuestionsDynamic,
      account
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

