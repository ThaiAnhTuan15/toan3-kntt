'use client';
import React, { useState } from 'react';
import { LearningProvider, useLearning } from '../context/LearningContext';
import { Navbar } from './Navbar';
import { RoadmapView } from './RoadmapView';
import { CustomPractice } from './CustomPractice';
import { WrongQuestionsReview } from './WrongQuestionsReview';
import { ParentDashboard } from './ParentDashboard';
import { BadgesModal } from './BadgesModal';
import { QuizArena } from './QuizArena';
import { ResultModal } from './ResultModal';
import { ExplanationView } from './ExplanationView';
import { StudentAuthModal } from './StudentAuthModal';
import { Users, Lock, LogOut, Edit2, Trash2, Check, X, User } from 'lucide-react';

const MainContent = ({ onLogout }) => {
  const { profile, saveQuizResult, getQuestionsByWeek, currentSubject, isMath, isApiLoading, currentMetadata } = useLearning();
  const [currentTab, setCurrentTab] = useState('roadmap'); // 'roadmap' | 'practice' | 'wrong' | 'dashboard' | 'badges'
  const [activeQuizConfig, setActiveQuizConfig] = useState(null);
  const [currentResultData, setCurrentResultData] = useState(null);
  const [currentEarnedRewards, setCurrentEarnedRewards] = useState(null);
  const [isViewingExplanation, setIsViewingExplanation] = useState(false);

  // Start a Quiz
  const handleStartQuiz = (config) => {
      let questions = config.questions;
      if (!questions && config.week) {
        const weekQuestions = getQuestionsByWeek(config.week);
        const shuffleArr = arr => [...arr].sort(() => 0.5 - Math.random());
        
        if (config.difficulty === 'all') {
          // Sử dụng trọn vẹn toàn bộ câu hỏi của đề (10-15 câu), giữ nguyên thứ tự sư phạm Dễ -> Khó
          questions = [...weekQuestions].sort((a, b) => (a.order_in_quiz || 0) - (b.order_in_quiz || 0));
        } else {
          // Chuyên đề nâng cao / dễ / trung bình
          let filtered = weekQuestions.filter(q => q.difficulty === config.difficulty);
          if (filtered.length === 0) filtered = weekQuestions; // fallback
          questions = [...filtered].sort((a, b) => (a.order_in_quiz || 0) - (b.order_in_quiz || 0));
        }
      }

      if (!questions || questions.length === 0) {
        alert("Chưa có câu hỏi cho phần này!");
        return;
      }

      // Prepare questions & Shuffle options
      const preparedQuestions = questions.map(q => {
        if (!q.options || q.options.length === 0) return { ...q };
        
        const originalOptions = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctIndex }));
        // Xáo trộn đáp án A B C D
        for (let i = originalOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [originalOptions[i], originalOptions[j]] = [originalOptions[j], originalOptions[i]];
        }
        
        return {
          ...q,
          options: originalOptions.map(opt => opt.text),
          correctIndex: originalOptions.findIndex(opt => opt.isCorrect)
        };
      });

      const quizMeta = currentMetadata ? currentMetadata[config.week] : null;
    const timeLimit = config.timeLimitSec || (quizMeta?.time_limit_sec) || (preparedQuestions.length <= 12 ? 720 : 900); // 75s per question

    setActiveQuizConfig({
      type: config.type || 'week',
      week: config.week || null,
      title: config.title || `Luyện tập Tuần ${config.week || ''}`,
      questions: preparedQuestions,
      timeLimitSec: timeLimit
    });
    setCurrentResultData(null);
    setIsViewingExplanation(false);
  };

  // Finish Quiz & Submit
  const handleFinishQuiz = (resultPayload) => {
    const fullResultData = {
      ...resultPayload,
      subject: currentSubject,
      type: activeQuizConfig.type,
      week: activeQuizConfig.week,
      title: activeQuizConfig.title
    };

    const rewards = saveQuizResult(fullResultData);
    setCurrentResultData(fullResultData);
    setCurrentEarnedRewards(rewards);
  };

  // Retry Current Quiz
  const handleRetryCurrentQuiz = () => {
    if (!activeQuizConfig) return;
    const restartConfig = { ...activeQuizConfig };
    setCurrentResultData(null);
    setIsViewingExplanation(false);
    setActiveQuizConfig(restartConfig);
  };

  // Retry Wrong Only Questions
  const handleRetryWrongOnly = () => {
    if (!currentResultData) return;
    const wrongItems = currentResultData.details.filter(d => !d.isCorrect);
    if (wrongItems.length === 0) return;

    const wrongQuestions = wrongItems.map(d => d.question);
    setActiveQuizConfig({
      type: 'retry_wrong',
      week: currentResultData.week,
      title: `Luyện Lại Câu Sai (${wrongQuestions.length} câu)`,
      questions: wrongQuestions,
      timeLimitSec: Math.max(180, wrongQuestions.length * 90)
    });
    setCurrentResultData(null);
    setIsViewingExplanation(false);
  };

  // Exit Quiz
  const handleExitQuiz = () => {
    setActiveQuizConfig(null);
    setCurrentResultData(null);
    setIsViewingExplanation(false);
  };


  if (isApiLoading) {
    return null;
  }

  return (
    <div className={`min-h-screen font-nunito text-slate-800 ${
      isMath 
        ? 'bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30' 
        : 'bg-gradient-to-b from-rose-50/50 via-white to-purple-50/30'
    }`}>
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        onSelectTab={(tab) => {
          if (tab === 'badges') {
            setCurrentTab('badges');
          } else {
            setCurrentTab(tab);
          }
        }}
        isQuizActive={Boolean(activeQuizConfig && !currentResultData)}
        onLogout={onLogout}
      />

      {/* Main Tab Routing */}
      <main className={`pb-16 pt-4 ${(activeQuizConfig || currentResultData) ? 'hidden' : ''}`}>
        {currentTab === 'roadmap' && (
          <RoadmapView onStartQuiz={handleStartQuiz} />
        )}

        {currentTab === 'practice' && (
          <CustomPractice onStartQuiz={handleStartQuiz} />
        )}

        {currentTab === 'wrong' && (
          <WrongQuestionsReview onStartQuiz={handleStartQuiz} />
        )}

        {currentTab === 'dashboard' && (
          <ProtectedDashboard />
        )}

        {currentTab === 'badges' && (
          <BadgesModal onClose={() => setCurrentTab('roadmap')} />
        )}
      </main>

      {/* Quiz Modal Player */}
      {activeQuizConfig && !currentResultData && (
        <QuizArena
          title={activeQuizConfig.title}
          questions={activeQuizConfig.questions}
          timeLimitSec={activeQuizConfig.timeLimitSec}
          onFinishQuiz={handleFinishQuiz}
          onExitQuiz={handleExitQuiz}
        />
      )}

      {/* Result Celebration Modal */}
      {currentResultData && !isViewingExplanation && (
        <ResultModal
          resultData={currentResultData}
          onOpenExplanations={() => setIsViewingExplanation(true)}
          onRetryQuiz={handleRetryCurrentQuiz}
          onRetryWrongOnly={handleRetryWrongOnly}
          onBackToRoadmap={handleExitQuiz}
        />
      )}

      {/* Step-by-Step Explanation Review Modal */}
      {currentResultData && isViewingExplanation && (
        <ExplanationView
            quizTitle={currentResultData.title}
            details={currentResultData.details}
            onBack={() => setIsViewingExplanation(false)}
            onRetryWrongOnly={handleRetryWrongOnly}
          />
      )}
    </div>
  );
};

function OldApp() {
  return (
    <LearningProvider>
      <MainContent />
    </LearningProvider>
  );
}




const ProfileSelector = ({ onSelect }) => {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('agy_profiles');
      return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Bé Bi', avatar: '🐯' }];
    } catch { return [{ id: 'default', name: 'Bé Bi', avatar: '🐯' }]; }
  });
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐯');
  const [editingProfile, setEditingProfile] = useState(null);
  const avatars = ['🐯', '🐰', '🐼', '🦊', '🐶', '🐱', '🦁', '🐸', '🐵', '🦉'];
  
  const handleSelectProfile = (p) => {
    // 1. Keep activeProfileId and activeProfileData up to date
    localStorage.setItem('activeProfileId', p.id);
    localStorage.setItem('activeProfileData', JSON.stringify(p));
    
    // 2. Ensure agy_profile_{p.id} exists and has matching name & avatar
    const key = `agy_profile_${p.id}`;
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify({
        name: p.name,
        avatar: p.avatar,
        mascot: p.avatar,
        avatarColor: '#FFD166'
      }));
    } else {
      try {
        const parsed = JSON.parse(existing);
        parsed.name = p.name;
        parsed.avatar = p.avatar;
        parsed.mascot = p.avatar;
        localStorage.setItem(key, JSON.stringify(parsed));
      } catch (e) {}
    }
    
    onSelect(p.id);
  };

  const handleAdd = () => {
    if (!newProfileName.trim()) return;
    const newId = 'p_' + Date.now();
    const newP = {
      id: newId,
      name: newProfileName.trim(),
      avatar: selectedAvatar
    };
    const updated = [...profiles, newP];
    setProfiles(updated);
    localStorage.setItem('agy_profiles', JSON.stringify(updated));
    localStorage.setItem(`agy_profile_${newId}`, JSON.stringify({
      name: newP.name,
      avatar: newP.avatar,
      mascot: newP.avatar,
      avatarColor: '#FFD166'
    }));
    setNewProfileName('');
  };

  const handleStartEdit = (p, e) => {
    e.stopPropagation();
    setEditingProfile({ ...p });
  };

  const handleSaveEdit = () => {
    if (!editingProfile || !editingProfile.name.trim()) return;
    const trimmedName = editingProfile.name.trim();
    const updated = profiles.map(p => 
      p.id === editingProfile.id 
        ? { ...p, name: trimmedName, avatar: editingProfile.avatar }
        : p
    );
    setProfiles(updated);
    localStorage.setItem('agy_profiles', JSON.stringify(updated));

    // Update specific storage
    const key = `agy_profile_${editingProfile.id}`;
    const existing = localStorage.getItem(key);
    const parsed = existing ? JSON.parse(existing) : {};
    localStorage.setItem(key, JSON.stringify({
      ...parsed,
      name: trimmedName,
      avatar: editingProfile.avatar,
      mascot: editingProfile.avatar
    }));

    // If currently active was this one, update activeProfileData
    const activeId = localStorage.getItem('activeProfileId');
    if (activeId === editingProfile.id) {
      localStorage.setItem('activeProfileData', JSON.stringify({
        id: editingProfile.id,
        name: trimmedName,
        avatar: editingProfile.avatar
      }));
    }

    setEditingProfile(null);
  };

  const handleDelete = (pId, e) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert('Phải giữ lại ít nhất 1 tài khoản học sinh!');
      return;
    }
    const target = profiles.find(p => p.id === pId);
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${target?.name || 'học sinh này'}" không? Dữ liệu điểm số của bé sẽ bị xóa.`)) {
      const updated = profiles.filter(p => p.id !== pId);
      setProfiles(updated);
      localStorage.setItem('agy_profiles', JSON.stringify(updated));

      // Cleanup
      const keysToRemove = [
        `agy_profile_${pId}`,
        `agy_prog_g4m_${pId}`,
        `agy_history_${pId}`,
        `agy_wrong_g4m_${pId}`,
        `agy_badges_${pId}`,
        `agy_streak_${pId}`,
        `agy_coins_${pId}`
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-lg w-full text-center border-4 border-amber-300 relative">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mb-2">Ai đang học toán thế nhỉ?</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-6">Chọn tài khoản của bé hoặc thêm bé mới để lưu kết quả riêng</p>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {profiles.map(p => (
            <div
              key={p.id}
              onClick={() => handleSelectProfile(p)}
              className="relative p-5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 border-2 border-amber-200 hover:border-amber-400 transition-all flex flex-col items-center gap-2.5 group cursor-pointer shadow-sm hover:shadow-md"
            >
              {/* Action buttons (Edit & Delete) */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => handleStartEdit(p, e)}
                  title="Chỉnh sửa tên và linh vật"
                  className="p-1.5 rounded-lg bg-white/90 hover:bg-amber-200 text-amber-800 transition-colors shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {profiles.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(p.id, e)}
                    title="Xóa tài khoản này"
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-100 text-rose-600 transition-colors shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-5xl group-hover:scale-110 transition-transform mt-2">{p.avatar}</div>
              <div className="font-extrabold text-slate-800 text-base sm:text-lg truncate max-w-full">{p.name}</div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                Vào học 🚀
              </span>
            </div>
          ))}
        </div>
        
        {/* Add New Profile Section */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border-2 border-slate-100 text-left">
          <h3 className="text-slate-600 font-extrabold text-sm mb-2 text-center">Thêm tài khoản bé mới</h3>
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {avatars.map(av => (
              <button 
                key={av} 
                type="button"
                onClick={() => setSelectedAvatar(av)}
                className={`text-2xl p-1.5 rounded-xl transition-all ${selectedAvatar === av ? 'bg-amber-300 scale-110 ring-2 ring-amber-400' : 'bg-white hover:bg-slate-100'}`}
              >
                {av}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Tên bé mới..." 
              value={newProfileName}
              maxLength={20}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-amber-400 font-bold text-slate-700 text-sm"
            />
            <button 
              type="button"
              onClick={handleAdd}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl transition-all text-sm whitespace-nowrap shadow-sm"
            >
              + Thêm
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Sửa Thông Tin Bé</h3>
              
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {avatars.map(av => (
                  <button 
                    key={av} 
                    type="button"
                    onClick={() => setEditingProfile({ ...editingProfile, avatar: av })}
                    className={`text-2xl p-1.5 rounded-xl transition-all ${editingProfile.avatar === av ? 'bg-amber-300 scale-110 ring-2 ring-amber-400' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {av}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={editingProfile.name}
                  maxLength={20}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  placeholder="Tên bé..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-center"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-sm"
                >
                  Lưu Lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// Parent Corner Wrapper
const ProtectedDashboard = () => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { parentPin, updateParentPin, resetProgress, account } = useLearning();

  const [newPin, setNewPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-xl border-4 border-slate-200 text-center relative">
        <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Góc Phụ Huynh</h2>
        <p className="text-slate-500 mb-3 font-semibold text-sm">Vui lòng nhập mật khẩu riêng của Ba Mẹ</p>
        <input 
          type="password"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full text-center text-3xl tracking-widest px-4 py-3 rounded-xl border-2 border-slate-200 mb-2 focus:border-blue-400 outline-none"
          placeholder="••••"
        />
        <p className="text-[11px] font-bold text-rose-500 mb-4">
          🔒 Không thể dùng mật khẩu của bé để mở Góc Phụ Huynh.
        </p>
        <button 
          onClick={() => {
            if (account?.pin && pin === account.pin && pin !== parentPin) {
              alert('Đây là mật khẩu của bé! Vui lòng nhập mật khẩu riêng của Ba Mẹ.');
              return;
            }
            if (pin === parentPin) {
              setIsAuthenticated(true);
            } else {
              alert('Mật khẩu Ba Mẹ không đúng!');
            }
          }}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl mb-4"
        >
          Xác Nhận Mở Khóa 🔑
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ParentDashboard />
      
      {/* Change PIN Settings */}
      <div className="bg-slate-50 border-2 border-slate-200 p-6 rounded-3xl text-center">
        <h3 className="text-xl font-bold text-slate-700 mb-2">Đổi Mã PIN</h3>
        <p className="text-slate-500 text-sm font-semibold mb-4">Mã PIN dùng để bảo vệ Góc Phụ Huynh và Cổng Ba Mẹ Quản Trị.</p>
        
        {isChangingPin ? (
          <div className="flex flex-col items-center gap-3">
            <input 
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              className="w-48 text-center text-2xl tracking-widest px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 outline-none"
              placeholder="Mã PIN mới"
            />
            <div className="flex gap-2 w-48">
              <button 
                onClick={() => {
                  setIsChangingPin(false);
                  setNewPin('');
                }}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm"
              >
                Hủy
              </button>
              <button 
                onClick={async () => {
                  if (!/^\d{4}$/.test(newPin)) {
                    alert('Mã PIN phải có đúng 4 chữ số!');
                    return;
                  }
                  if (account?.pin && newPin === account.pin) {
                    alert('Mã PIN của Ba Mẹ không được trùng với mật khẩu của bé!');
                    return;
                  }
                  await updateParentPin(newPin);
                  setIsChangingPin(false);
                  setNewPin('');
                  alert('Đổi mã PIN thành công! Mã mới đã được đồng bộ lên Cổng Quản Trị.');
                }}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm"
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChangingPin(true)}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl shadow-sm"
          >
            Đổi mã PIN mới
          </button>
        )}
      </div>

      <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl text-center">
        <h3 className="text-xl font-bold text-rose-700 mb-2">Cài Đặt Dữ Liệu</h3>
        <p className="text-rose-600/80 text-sm font-semibold mb-6">Xóa toàn bộ điểm số, huy chương và tiến trình của tài khoản hiện tại để bắt đầu lại từ đầu.</p>
        <button 
          onClick={async () => {
            if (window.confirm('Ba Mẹ có CHẮC CHẮN muốn xóa toàn bộ lịch sử thi thử, điểm số và Heo Đất của bé để bắt đầu học mới tinh từ đầu không? Hành động này không thể hoàn tác!')) {
              setIsResetting(true);
              const ok = await resetProgress(pin);
              if (!ok) {
                setIsResetting(false);
              }
            }
          }}
          disabled={isResetting}
          className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 disabled:opacity-50 cursor-pointer transition-all"
        >
          {isResetting ? 'Đang Đặt Lại Dữ Liệu Mới Tinh...' : 'Xóa Dữ Liệu & Học Lại Từ Đầu'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeAccount, setActiveAccount] = useState(() => {
    try {
      const saved = localStorage.getItem('agy_active_account');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    try {
      const acc = localStorage.getItem('agy_active_account');
      if (acc) {
        return JSON.parse(acc).id;
      }
      return localStorage.getItem('activeProfileId');
    } catch { return null; }
  });

  const [isOfflineGuest, setIsOfflineGuest] = useState(false);

  // Background refresh cloud account on startup if logged in
  React.useEffect(() => {
    if (activeAccount?.username && activeAccount?.pin) {
      fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: activeAccount.username,
          pin: activeAccount.pin
        })
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.account) {
          const fresh = resData.account;
          setActiveAccount(fresh);
          localStorage.setItem('agy_active_account', JSON.stringify(fresh));
          localStorage.setItem('activeProfileData', JSON.stringify({
            id: fresh.id,
            name: fresh.nickname || fresh.username,
            avatar: fresh.avatar || '🐯'
          }));
        }
      })
      .catch(err => console.warn('Could not refresh cloud account from server:', err));
    }
  }, []);

  // If not logged in and not choosing offline guest, show StudentAuthModal
  if (!activeAccount && !isOfflineGuest) {
    return (
      <StudentAuthModal 
        onLoginSuccess={(acc) => {
          localStorage.setItem('agy_active_account', JSON.stringify(acc));
          localStorage.setItem('activeProfileId', acc.id);
          localStorage.setItem('activeProfileData', JSON.stringify({
            id: acc.id,
            name: acc.nickname || acc.username,
            avatar: acc.avatar || '🐯'
          }));
          setActiveAccount(acc);
          setActiveProfileId(acc.id);
        }}
        onContinueOffline={() => {
          setIsOfflineGuest(true);
        }}
      />
    );
  }

  // If in guest mode and no profile selected yet
  if (!activeProfileId) {
    return (
      <ProfileSelector onSelect={(id) => {
        localStorage.setItem('activeProfileId', id);
        setActiveProfileId(id);
      }} />
    );
  }

  return (
    <LearningProvider 
      key={activeProfileId} 
      profileId={activeProfileId}
      account={activeAccount}
      onUpdateAccount={(updatedAcc) => {
        setActiveAccount(updatedAcc);
        localStorage.setItem('agy_active_account', JSON.stringify(updatedAcc));
      }}
    >
      <MainContent 
        onLogout={() => {
          try {
            const sid = localStorage.getItem('agy_session_id');
            if (activeAccount?.id) {
              fetch('/api/student/session/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId: activeAccount.id, sessionId: sid })
              }).catch(() => {});
            }
          } catch {}
          // Hard Flush: Xoa sach toan bo cache dem de tranh ro ri du lieu sang tai khoan be khac
          try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && (k.startsWith('agy_') || k.startsWith('toan_') || k === 'activeProfileId')) {
                keysToRemove.push(k);
              }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
          } catch {}
          setActiveAccount(null);
          setActiveProfileId(null);
          setIsOfflineGuest(false);
        }} 
      />
    </LearningProvider>
  );
}


