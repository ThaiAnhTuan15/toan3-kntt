'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  // 1. Khởi Đầu & Điểm Số Xuất Sắc
  { 
    id: 'first_quiz', 
    name: 'Bước Chân Đầu Tiên', 
    desc: 'Hoàn thành bài luyện tập Toán đầu tiên', 
    icon: 'Footprints', 
    category: 'accuracy',
    color: 'from-amber-400 to-orange-400',
    req: (h) => (h || []).length >= 1 
  },
  { 
    id: 'perfect_10', 
    name: 'Điểm 10 Hoàn Hảo', 
    desc: 'Đạt điểm tối đa 100% trong 1 bài thi Toán', 
    icon: 'Award', 
    category: 'accuracy',
    color: 'from-yellow-400 to-amber-500',
    req: (h) => (h || []).some(q => q.score === 100) 
  },
  { 
    id: 'speedy_math', 
    name: 'Thần Tốc Tính Nhẩm', 
    desc: 'Đạt từ 90% trở lên với thời gian dưới 3 phút', 
    icon: 'Zap', 
    category: 'accuracy',
    color: 'from-cyan-400 to-blue-500',
    req: (h) => (h || []).some(q => q.score >= 90 && q.timeSpent > 0 && q.timeSpent <= 180) 
  },
  { 
    id: 'triple_ten', 
    name: 'Tam Hoa Điểm 10', 
    desc: 'Đạt điểm 100% tuyệt đối trong 3 bài thi Toán', 
    icon: 'Target', 
    category: 'accuracy',
    color: 'from-rose-400 to-pink-500',
    req: (h) => (h || []).filter(q => q.score === 100).length >= 3 
  },
  { 
    id: 'five_ten', 
    name: 'Ngũ Quý Điểm 10', 
    desc: 'Đạt điểm 100% tuyệt đối trong 5 bài thi Toán', 
    icon: 'Sparkles', 
    category: 'accuracy',
    color: 'from-purple-400 to-indigo-500',
    req: (h) => (h || []).filter(q => q.score === 100).length >= 5 
  },
  { 
    id: 'ten_ten', 
    name: 'Thập Toàn Thập Mỹ', 
    desc: 'Đạt điểm 100% tuyệt đối trong 10 bài thi Toán', 
    icon: 'Crown', 
    category: 'accuracy',
    color: 'from-amber-400 to-yellow-500',
    req: (h) => (h || []).filter(q => q.score === 100).length >= 10 
  },

  // 2. Chinh Phục 6 Chặng Toán Lớp 3
  { 
    id: 'stage1_hero', 
    name: 'Dũng Sĩ Số Học', 
    desc: 'Chinh phục toàn bộ Đề 1 đến 13 (Chặng 1)', 
    icon: 'Rocket', 
    category: 'stage',
    color: 'from-amber-400 to-orange-500',
    req: (h, p) => [1,2,3,4,5,6,7,8,9,10,11,12,13].every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },
  { 
    id: 'stage2_hero', 
    name: 'Phù Thủy Cửu Chương', 
    desc: 'Chinh phục toàn bộ Đề 14 đến 23 (Chặng 2)', 
    icon: 'Sparkles', 
    category: 'stage',
    color: 'from-emerald-400 to-teal-500',
    req: (h, p) => [14,15,16,17,18,19,20,21,22,23].every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },
  { 
    id: 'stage3_hero', 
    name: 'Kiến Trúc Sư Hình Học', 
    desc: 'Chinh phục toàn bộ Đề 24 đến 36 (Chặng 3)', 
    icon: 'ShieldCheck', 
    category: 'stage',
    color: 'from-blue-400 to-indigo-600',
    req: (h, p) => [24,25,26,27,28,29,30,31,32,33,34,35,36].every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },
  { 
    id: 'stage4_hero', 
    name: 'Chiến Binh Hai Bước Tính', 
    desc: 'Chinh phục toàn bộ Đề 37 đến 48 (Chặng 4)', 
    icon: 'Flame', 
    category: 'stage',
    color: 'from-rose-400 to-red-600',
    req: (h, p) => [37,38,39,40,41,42,43,44,45,46,47,48].every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },
  { 
    id: 'stage5_hero', 
    name: 'Nhà Thám Hiểm Đo Lường', 
    desc: 'Chinh phục toàn bộ Đề 49 đến 57 (Chặng 5)', 
    icon: 'Compass', 
    category: 'stage',
    color: 'from-teal-400 to-cyan-600',
    req: (h, p) => [49,50,51,52,53,54,55,56,57].every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },
  { 
    id: 'stage6_hero', 
    name: 'Đại Trí Tuệ Ôn Tập', 
    desc: 'Chinh phục toàn bộ Đề 58 đến 66 (Chặng 6)', 
    icon: 'Award', 
    category: 'stage',
    color: 'from-violet-500 to-purple-700',
    req: (h, p) => [58,59,60,61,62,63,64,65,66].every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },
  { 
    id: 'grandmaster_math3', 
    name: 'Đại Kiện Tướng Toán 3', 
    desc: 'Chinh phục trọn vẹn toàn bộ 66 đề thi Toán 3', 
    icon: 'Crown', 
    category: 'stage',
    color: 'from-amber-400 via-yellow-400 to-orange-500',
    req: (h, p) => Array.from({length: 66}, (_, i) => i + 1).every(w => (p.g4Math?.[w]?.bestScore || 0) >= 75) 
  },

  // 3. Số Lượng Bài Đã Làm (Milestones)
  { 
    id: 'quiz_count_3', 
    name: 'Mầm Non Toán Học', 
    desc: 'Hoàn thành 3 đề thi Toán 3', 
    icon: 'BookOpen', 
    category: 'milestone',
    color: 'from-lime-400 to-emerald-500',
    req: (h) => (h || []).length >= 3 
  },
  { 
    id: 'quiz_count_5', 
    name: 'Hạt Giống Tri Thức', 
    desc: 'Hoàn thành 5 đề thi Toán 3', 
    icon: 'BookOpen', 
    category: 'milestone',
    color: 'from-emerald-400 to-green-600',
    req: (h) => (h || []).length >= 5 
  },
  { 
    id: 'quiz_count_10', 
    name: 'Chồi Non Bứt Phá', 
    desc: 'Hoàn thành 10 đề thi Toán 3', 
    icon: 'TrendingUp', 
    category: 'milestone',
    color: 'from-teal-400 to-emerald-600',
    req: (h) => (h || []).length >= 10 
  },
  { 
    id: 'quiz_count_20', 
    name: 'Nhà Leo Núi Kiên Trì', 
    desc: 'Hoàn thành 20 đề thi Toán 3', 
    icon: 'ShieldCheck', 
    category: 'milestone',
    color: 'from-blue-400 to-cyan-600',
    req: (h) => (h || []).length >= 20 
  },
  { 
    id: 'quiz_count_35', 
    name: 'Nhà Du Hành Không Gian', 
    desc: 'Hoàn thành 35 đề thi Toán 3', 
    icon: 'Rocket', 
    category: 'milestone',
    color: 'from-indigo-400 to-purple-600',
    req: (h) => (h || []).length >= 35 
  },
  { 
    id: 'quiz_count_50', 
    name: 'Hiệp Sĩ Bất Bại', 
    desc: 'Hoàn thành 50 đề thi Toán 3', 
    icon: 'Crown', 
    category: 'milestone',
    color: 'from-amber-400 to-rose-500',
    req: (h) => (h || []).length >= 50 
  },

  // 4. Ngôi Sao Tri Thức
  { 
    id: 'star_hunter_9', 
    name: 'Ngôi Sao Đầu Đời', 
    desc: 'Tích lũy được từ 9 ngôi sao', 
    icon: 'Star', 
    category: 'star',
    color: 'from-yellow-300 to-amber-400',
    req: (h, p, s, stars) => stars >= 9 
  },
  { 
    id: 'star_hunter_30', 
    name: 'Thợ Săn Ngôi Sao', 
    desc: 'Tích lũy được trên 30 ngôi sao', 
    icon: 'Star', 
    category: 'star',
    color: 'from-amber-400 to-orange-400',
    req: (h, p, s, stars) => stars >= 30 
  },
  { 
    id: 'star_hunter_60', 
    name: 'Bầu Trời Sao Sáng', 
    desc: 'Tích lũy được trên 60 ngôi sao', 
    icon: 'Sparkles', 
    category: 'star',
    color: 'from-orange-400 to-pink-500',
    req: (h, p, s, stars) => stars >= 60 
  },
  { 
    id: 'star_hunter_100', 
    name: 'Dải Ngân Hà Tri Thức', 
    desc: 'Tích lũy được trên 100 ngôi sao', 
    icon: 'Crown', 
    category: 'star',
    color: 'from-purple-400 to-indigo-600',
    req: (h, p, s, stars) => stars >= 100 
  },
  { 
    id: 'star_hunter_150', 
    name: 'Mặt Trời Tỏa Sáng', 
    desc: 'Tích lũy được trên 150 ngôi sao', 
    icon: 'Award', 
    category: 'star',
    color: 'from-yellow-400 to-red-500',
    req: (h, p, s, stars) => stars >= 150 
  },

  // 5. Heo Đất Tri Thức & Tiết Kiệm
  { 
    id: 'piggy_30k', 
    name: 'Heo Con No Nê', 
    desc: 'Tích lũy được từ 30.000đ trong Heo Đất', 
    icon: 'Coins', 
    category: 'piggy',
    color: 'from-pink-400 to-rose-500',
    req: (h, p, s, stars, extra) => (extra?.piggyBalance || 0) >= 30000 
  },
  { 
    id: 'piggy_50k', 
    name: 'Túi Càng Khôn', 
    desc: 'Tích lũy được từ 50.000đ trong Heo Đất', 
    icon: 'Coins', 
    category: 'piggy',
    color: 'from-rose-400 to-red-500',
    req: (h, p, s, stars, extra) => (extra?.piggyBalance || 0) >= 50000 
  },
  { 
    id: 'piggy_100k', 
    name: 'Kho Báu Tri Thức', 
    desc: 'Tích lũy được từ 100.000đ trong Heo Đất', 
    icon: 'Award', 
    category: 'piggy',
    color: 'from-purple-500 to-rose-500',
    req: (h, p, s, stars, extra) => (extra?.piggyBalance || 0) >= 100000 
  },
  { 
    id: 'piggy_200k', 
    name: 'Triệu Phú Heo Đất', 
    desc: 'Tích lũy được từ 200.000đ trong Heo Đất', 
    icon: 'Crown', 
    category: 'piggy',
    color: 'from-amber-400 to-pink-500',
    req: (h, p, s, stars, extra) => (extra?.piggyBalance || 0) >= 200000 
  },

  // 6. Chăm Chỉ & Rèn Luyện (Streak)
  { 
    id: 'streak_3', 
    name: 'Chăm Chỉ Chuyên Cần', 
    desc: 'Học liên tục trong 3 ngày', 
    icon: 'Flame', 
    category: 'streak',
    color: 'from-orange-400 to-red-500',
    req: (h, p, s) => (s?.currentStreak || 1) >= 3 
  },
  { 
    id: 'streak_7', 
    name: 'Ý Chí Thép', 
    desc: 'Học liên tục trong 7 ngày', 
    icon: 'Flame', 
    category: 'streak',
    color: 'from-red-500 to-rose-600',
    req: (h, p, s) => (s?.currentStreak || 1) >= 7 
  },
  { 
    id: 'streak_14', 
    name: 'Chiến Binh Bất Bại', 
    desc: 'Học liên tục trong 14 ngày', 
    icon: 'ShieldCheck', 
    category: 'streak',
    color: 'from-purple-500 to-red-500',
    req: (h, p, s) => (s?.currentStreak || 1) >= 14 
  },

  // 7. Xu Thưởng & Thám Tử Tinh Mắt
  { 
    id: 'coin_hunter_200', 
    name: 'Thỏi Vàng Đầu Tiên', 
    desc: 'Tích lũy được 200 xu thưởng', 
    icon: 'Coins', 
    category: 'piggy',
    color: 'from-yellow-400 to-amber-500',
    req: (h, p, s, stars, extra) => (extra?.coins || 0) >= 200 
  },
  { 
    id: 'coin_hunter_500', 
    name: 'Kho Báu Vàng Ròng', 
    desc: 'Tích lũy được 500 xu thưởng', 
    icon: 'Coins', 
    category: 'piggy',
    color: 'from-amber-400 to-yellow-600',
    req: (h, p, s, stars, extra) => (extra?.coins || 0) >= 500 
  },
  { 
    id: 'coin_hunter_1000', 
    name: 'Thần Tài Nhí', 
    desc: 'Tích lũy được 1.000 xu thưởng', 
    icon: 'Crown', 
    category: 'piggy',
    color: 'from-yellow-400 via-amber-500 to-orange-500',
    req: (h, p, s, stars, extra) => (extra?.coins || 0) >= 1000 
  },
  { 
    id: 'bug_detective', 
    name: 'Thám Tử Tinh Mắt', 
    desc: 'Phát hiện và báo cáo câu hỏi lỗi tới Ba Mẹ', 
    icon: 'Search', 
    category: 'accuracy',
    color: 'from-sky-400 to-blue-600',
    req: (h, p, s, stars, extra) => (extra?.reportedQuestions?.length || 0) >= 1 
  },
  { 
    id: 'g4_tv_master', 
    name: 'Trạng Nguyên Tiếng Việt', 
    desc: 'Hoàn thành trên 10 tuần Tiếng Việt 3', 
    icon: 'BookOpen', 
    category: 'milestone',
    color: 'from-pink-400 to-rose-600',
    req: (h, p) => Object.keys(p.g4Tv || {}).filter(w => p.g4Tv[w]?.bestScore >= 70).length >= 10 
  }
];

export const LearningProvider = ({ children, profileId = 'default', account = null, onUpdateAccount = null }) => {
  const STORAGE_KEYS = getStorageKeys(profileId);

  // Helper: Uu tien du lieu dam may cua tai khoan (Cloud Account) lam goc, fallback sang LocalStorage khi offline
  const getInitialVal = (storageKey, cloudProp, defaultVal) => {
    if (account?.data && account.data[cloudProp] !== undefined) {
      return account.data[cloudProp];
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null && saved !== undefined) return JSON.parse(saved);
    } catch (e) {}
    return defaultVal;
  };

  // Current active Grade: '4' | '7'
  const [currentGrade, setCurrentGrade] = useState(() => {
    const saved = getInitialVal(STORAGE_KEYS.GRADE, 'currentGrade', '4'); return (saved === '7' ? '4' : saved) || '4';
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

  const updateParentPin = async (newPin) => {
    const clean = String(newPin).trim();
    setParentPin(clean);
    sounds.playClick();
    try {
      localStorage.setItem(STORAGE_KEYS.PARENT_PIN, JSON.stringify(clean));
    } catch {}

    if (account && account.id) {
      setAccount(prev => prev ? {
        ...prev,
        data: { ...(prev.data || {}), parentPin: clean }
      } : prev);

      try {
        await fetch('/api/student/parent-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: account.id,
            username: account.username,
            newParentPin: clean
          })
        });
      } catch (e) {
        console.warn('Sync parent PIN error:', e);
      }
    }
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
  const [isApiLoading, setIsApiLoading] = useState(false);

  useEffect(() => {
    setIsApiLoading(false);
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

  const isHydratedRef = useRef(false);

  // Hydrate state from cloud account when account prop is available or updated
  useEffect(() => {
    if (!account) {
      isHydratedRef.current = true;
      return;
    }
    if (!account.data || typeof account.data !== 'object') {
      isHydratedRef.current = true;
      return;
    }

    const cloud = account.data;

    if (cloud.g4MathProgress && Object.keys(cloud.g4MathProgress).length > 0) {
      setG4MathProgress(prev => {
        const merged = { ...cloud.g4MathProgress };
        for (const [k, v] of Object.entries(prev || {})) {
          if (!merged[k]) {
            merged[k] = v;
          } else {
            merged[k] = {
              ...merged[k],
              bestScore: Math.max(merged[k]?.bestScore || 0, v?.bestScore || 0),
              stars: Math.max(merged[k]?.stars || 0, v?.stars || 0),
              attempts: Math.max(merged[k]?.attempts || 0, v?.attempts || 0),
              unlocked: Boolean(merged[k]?.unlocked || v?.unlocked)
            };
          }
        }
        return merged;
      });
    }

    if (cloud.g4TvProgress && Object.keys(cloud.g4TvProgress).length > 0) {
      setG4TvProgress(prev => ({ ...cloud.g4TvProgress, ...prev }));
    }
    if (cloud.g7MathProgress && Object.keys(cloud.g7MathProgress).length > 0) {
      setG7MathProgress(prev => ({ ...cloud.g7MathProgress, ...prev }));
    }
    if (cloud.g7LitProgress && Object.keys(cloud.g7LitProgress).length > 0) {
      setG7LitProgress(prev => ({ ...cloud.g7LitProgress, ...prev }));
    }

    if (Array.isArray(cloud.history) && cloud.history.length > 0) {
      setHistory(prev => {
        const idMap = new Map();
        cloud.history.forEach(h => idMap.set(String(h.id || `${h.date}_${h.week}`), h));
        (prev || []).forEach(h => {
          const k = String(h.id || `${h.date}_${h.week}`);
          if (!idMap.has(k)) idMap.set(k, h);
        });
        return Array.from(idMap.values()).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      });
    }

    if (typeof cloud.piggyBalance === 'number') {
      setPiggyBalance(cloud.piggyBalance);
      try { localStorage.setItem(STORAGE_KEYS.PIGGY_BANK, JSON.stringify(cloud.piggyBalance)); } catch {}
    }
    if (typeof cloud.coins === 'number') {
      setCoins(cloud.coins);
      try { localStorage.setItem(STORAGE_KEYS.COINS, JSON.stringify(cloud.coins)); } catch {}
    }
    if (Array.isArray(cloud.piggyHistory) && cloud.piggyHistory.length > 0) {
      setPiggyHistory(prev => {
        const idMap = new Map();
        cloud.piggyHistory.forEach(h => idMap.set(String(h.id || `${h.date}_${h.title}`), h));
        (prev || []).forEach(h => {
          const k = String(h.id || `${h.date}_${h.title}`);
          if (!idMap.has(k)) idMap.set(k, h);
        });
        return Array.from(idMap.values()).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      });
    }
    if (Array.isArray(cloud.piggyRequests)) {
      setPiggyRequests(cloud.piggyRequests);
    }
    if (Array.isArray(cloud.claimedStages) && cloud.claimedStages.length > 0) {
      setClaimedStages(prev => Array.from(new Set([...(prev || []), ...cloud.claimedStages])));
    }
    if (cloud.claimedFinal) {
      setClaimedFinal(true);
    }
    if (Array.isArray(cloud.badges) && cloud.badges.length > 0) {
      setUnlockedBadges(prev => Array.from(new Set([...(prev || []), ...cloud.badges])));
    }
    if (Array.isArray(cloud.reportedQuestions)) {
      setReportedQuestions(cloud.reportedQuestions);
    }
    if (Array.isArray(cloud.verifiedErrorIds)) {
      setVerifiedErrorIds(cloud.verifiedErrorIds);
    }
    if (cloud.parentPin && /^\d{4}$/.test(String(cloud.parentPin))) {
      setParentPin(String(cloud.parentPin));
      try {
        localStorage.setItem(STORAGE_KEYS.PARENT_PIN, JSON.stringify(String(cloud.parentPin)));
      } catch {}
    }

    isHydratedRef.current = true;
  }, [account?.id, account?.username]);

  // Auto-sync debounced to Cloud whenever progress, coins, piggy, etc. changes
  useEffect(() => {
    if (!account || !account.username || !account.pin) return;
    if (!isHydratedRef.current) return;

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
        verifiedErrorIds,
        parentPin
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
      })
      .then(res => res.json())
      .then(resData => {
        if (resData?.data && typeof resData.data.piggyBalance === 'number') {
          setPiggyBalance(resData.data.piggyBalance);
          try { localStorage.setItem(STORAGE_KEYS.PIGGY_BANK, JSON.stringify(resData.data.piggyBalance)); } catch {}
        }
        if (resData?.data && Array.isArray(resData.data.piggyRequests)) {
          setPiggyRequests(resData.data.piggyRequests);
          try { localStorage.setItem(STORAGE_KEYS.PIGGY_REQUESTS, JSON.stringify(resData.data.piggyRequests)); } catch {}
        }
      })
      .catch(err => console.warn('Background auto-sync error:', err));
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
    verifiedErrorIds,
    parentPin
  ]);

  // Derived active state
  const isMath = currentSubject === 'math';
  const isGrade7 = false;

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
    const extra = {
      coins,
      piggyBalance,
      reportedQuestions,
      verifiedErrorIds
    };
    BADGE_DEFINITIONS.forEach(b => {
      if (!unlockedBadges.includes(b.id)) {
        if (b.req(newHistory, fullProgress, streakData, currentStars, extra)) {
          newlyUnlocked.push(b.id);
        }
      }
    });
    if (newlyUnlocked.length > 0) {
      setUnlockedBadges(prev => [...prev, ...newlyUnlocked]);
      sounds.playUnlock();
    }
  };

  // Auto check badges on load & whenever stats change
  useEffect(() => {
    if (!isHydratedRef.current) return;
    checkBadges(history, totalStars);
  }, [history.length, totalStars, coins, piggyBalance, reportedQuestions.length]);

  // Session Heartbeat Check (every 30s)
  useEffect(() => {
    if (!account?.id) return;
    let sid = null;
    try { sid = localStorage.getItem('agy_session_id'); } catch {}
    if (!sid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/student/session/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: account.id,
            username: account.username,
            sessionId: sid
          })
        });
        const data = await res.json();
        if (data && data.active === false && data.reason === 'transferred') {
          alert('⚠️ Thông báo chuyển máy:\nTài khoản của bé vừa được đăng nhập trên một thiết bị khác. Phiên học trên máy này đã tạm dừng để tránh xung đột bài làm.');
          localStorage.removeItem('agy_active_account');
          window.location.reload();
        }
      } catch (err) {}
    }, 30000);

    return () => clearInterval(interval);
  }, [account?.id, account?.username]);

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
    let moneyTrans = null;

    // CHỈ THƯỞNG TIỀN HEO ĐẤT CHO BÀI HỌC CHÍNH THỨC TRÊN LỘ TRÌNH (Tuần/Bài 1..66)
    // Yêu cầu: Số câu tối thiểu (>= 8 câu) và điểm số tối thiểu (>= 50%)
    const isOfficialLesson = Boolean(week) && !isNaN(Number(week)) && Number(week) >= 1 && Number(week) <= 66 && (type === 'week' || !type);
    const hasEnoughQuestions = totalCount >= 8;
    const isEligibleForPiggy = isOfficialLesson && hasEnoughQuestions && score >= 50;

    const prevAttempts = isOfficialLesson ? ((progress[week]?.attempts) || 0) : 0;
    // Miễn trừ câu hỏi lỗi đã được xác nhận để không bị phạt trừ tiền heo đất:
    const verifiedErrorsInDetails = details ? details.filter(d => !d.isCorrect && verifiedErrorIds.includes(d.question.id)).length : 0;
    const wrongCount = Math.max(0, (totalCount - correctCount) - verifiedErrorsInDetails);

    if (isEligibleForPiggy) {
      if (prevAttempts === 0) {
        // Lần 1: Đúng hết 10.000đ, sai 1 câu trừ 2.000đ, sai >= 5 câu hoặc điểm < 70% là 0đ
        if (wrongCount < 5 && score >= 70) {
          earnedMoney = Math.max(0, 10000 - wrongCount * 2000);
        } else {
          earnedMoney = 0;
        }
      } else if (prevAttempts === 1) {
        // Lần 2: Đúng hết 5.000đ, sai 1 câu trừ 1.000đ, sai >= 5 câu hoặc điểm < 70% là 0đ
        if (wrongCount < 5 && score >= 70) {
          earnedMoney = Math.max(0, 5000 - wrongCount * 1000);
        } else {
          earnedMoney = 0;
        }
      } else {
        // Lần 3 trở đi: Đúng hết (100%) thưởng 2.000đ khích lệ kiên trì
        if (score === 100) {
          earnedMoney = 2000;
        } else {
          earnedMoney = 0;
        }
      }
    }

    if (earnedMoney > 0) {
      setPiggyBalance(prev => prev + earnedMoney);
      moneyTrans = {
        id: Date.now() + 1,
        date: new Date().toISOString(),
        title: `Làm Bài ${week} (Lần ${prevAttempts + 1})`,
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

    if (isOfficialLesson) {
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

    // Immediate Cloud Sync on Quiz Finish
    if (account?.id && account?.username && account?.pin) {
      try {
        const syncPayload = {
          accountId: account.id,
          username: account.username,
          pin: account.pin,
          data: {
            currentGrade: activeGrade,
            currentSubject: activeSubj,
            g4MathProgress: isActG7 ? g4MathProgress : (isActMath ? updateProgressObj(g4MathProgress) : g4MathProgress),
            g4TvProgress: isActG7 ? g4TvProgress : (!isActMath ? updateProgressObj(g4TvProgress) : g4TvProgress),
            g7MathProgress: isActG7 && isActMath ? updateProgressObj(g7MathProgress) : g7MathProgress,
            g7LitProgress: isActG7 && !isActMath ? updateProgressObj(g7LitProgress) : g7LitProgress,
            history: newHistory,
            wrongG4Math: isActG7 || !isActMath ? g4MathWrong : updateWrongList(g4MathWrong),
            wrongG4Tv: isActG7 || isActMath ? g4TvWrong : updateWrongList(g4TvWrong),
            wrongG7Math: !isActG7 || !isActMath ? g7MathWrong : updateWrongList(g7MathWrong),
            wrongG7Lit: !isActG7 || isActMath ? g7LitWrong : updateWrongList(g7LitWrong),
            badges: unlockedBadges,
            streakData,
            coins: coins + earnedCoins,
            piggyBalance: piggyBalance + earnedMoney + (stageReward ? stageReward.amount : 0) + (finalReward ? finalReward.amount : 0),
            piggyHistory: moneyTrans ? [moneyTrans, ...piggyHistory] : piggyHistory,
            piggyRequests,
            claimedStages: stageReward ? [...claimedStages, stageReward.stageId] : claimedStages,
            claimedFinal: finalReward ? true : claimedFinal,
            reportedQuestions,
            verifiedErrorIds,
            parentPin
          }
        };

        fetch('/api/student/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncPayload)
        }).catch(err => console.warn('Immediate quiz sync error:', err));
      } catch (e) {
        console.warn('Sync payload build error:', e);
      }
    }

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
