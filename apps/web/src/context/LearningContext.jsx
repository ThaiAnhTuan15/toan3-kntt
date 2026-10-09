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

const STORAGE_KEYS = {
  GRADE: 'toan_current_grade',
  SUBJECT: 'toan_current_subject',
  PROFILE: 'toan_user_profile',
  PROGRESS_G4_MATH: 'toan4_week_progress',
  PROGRESS_G4_TV: 'toan4_week_progress_tv',
  PROGRESS_G7_MATH: 'toan7_week_progress_math',
  PROGRESS_G7_LIT: 'toan7_week_progress_lit',
  HISTORY: 'toan_quiz_history',
  WRONG_G4_MATH: 'toan4_wrong_questions',
  WRONG_G4_TV: 'toan4_wrong_questions_tv',
  WRONG_G7_MATH: 'toan7_wrong_questions_math',
  WRONG_G7_LIT: 'toan7_wrong_questions_lit',
  BADGES: 'toan_badges',
  STREAK: 'toan_streak_data',
  FREE_MODE: 'toan_free_mode',
  COINS: 'toan_coins',
};

const DEFAULT_PROFILE = {
  name: 'Học Sinh Chăm Chỉ',
  mascot: 'elephant',
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

export const LearningProvider = ({ children }) => {
  // Current active Grade: '4' | '7'
  const [currentGrade, setCurrentGrade] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADE);
      return saved === '7' ? '7' : '4';
    } catch {
      return '4';
    }
  });

  // Current active Subject: 'math' | 'vietnamese'
  const [currentSubject, setCurrentSubject] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECT);
      return saved === 'vietnamese' ? 'vietnamese' : 'math';
    } catch {
      return 'math';
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Progress Stores
  const [g4MathProgress, setG4MathProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS_G4_MATH);
      return saved ? JSON.parse(saved) : { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    } catch {
      return { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    }
  });

  const [g4TvProgress, setG4TvProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS_G4_TV);
      return saved ? JSON.parse(saved) : { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    } catch {
      return { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    }
  });

  const [g7MathProgress, setG7MathProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS_G7_MATH);
      return saved ? JSON.parse(saved) : { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    } catch {
      return { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    }
  });

  const [g7LitProgress, setG7LitProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS_G7_LIT);
      return saved ? JSON.parse(saved) : { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    } catch {
      return { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } };
    }
  });

  // Quiz History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wrong Questions Stores
  const [g4MathWrong, setG4MathWrong] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRONG_G4_MATH);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [g4TvWrong, setG4TvWrong] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRONG_G4_TV);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [g7MathWrong, setG7MathWrong] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRONG_G7_MATH);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [g7LitWrong, setG7LitWrong] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRONG_G7_LIT);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [streakData, setStreakData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved ? JSON.parse(saved) : { currentStreak: 1, lastDate: new Date().toISOString().split('T')[0] };
    } catch {
      return { currentStreak: 1, lastDate: new Date().toISOString().split('T')[0] };
    }
  });

  const [isFreeMode,
      isApiLoading, setIsFreeMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FREE_MODE);
      return saved ? JSON.parse(saved) : false;
    } catch { return false; }
  });

  const [coins, setCoins] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COINS);
      return saved ? JSON.parse(saved) : 50;
    } catch { return 50; }
  });

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
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); }, [profile]);
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

    // Update wrong list
    const updateWrongList = (prevList) => {
      const updated = [...prevList];
      details.forEach(item => {
        if (!item.isCorrect) {
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

      if (score >= 75 && week < 35) {
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
    setProfile(prev => ({ ...prev, ...newProfile }));
    sounds.playClick();
  };

  return (
    <LearningContext.Provider value={{
      currentGrade,
      switchGrade,
      isGrade7,
      currentSubject,
      switchSubject,
      isMath,
      profile,
      updateProfile,
      progress,
      totalStars,
      coins,
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
      getFilteredQuestions: getFilteredQuestionsDynamic
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
