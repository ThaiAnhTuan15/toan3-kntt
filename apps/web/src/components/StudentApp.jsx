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

const MainContent = ({ onLogout }) => {
  const { profile, saveQuizResult, getQuestionsByWeek, currentSubject, isMath, isApiLoading } = useLearning();
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
          // Ma trận đề thi thông minh: 4 Dễ, 4 TB, 2 Khó
          const easyQs = weekQuestions.filter(q => q.difficulty === 'easy');
          const mediumQs = weekQuestions.filter(q => q.difficulty === 'medium');
          const hardQs = weekQuestions.filter(q => q.difficulty === 'hard');
          
          let matrixQs = [
            ...shuffleArr(easyQs).slice(0, 4),
            ...shuffleArr(mediumQs).slice(0, 4),
            ...shuffleArr(hardQs).slice(0, 2)
          ];
          
          if (matrixQs.length < 10) {
            const usedIds = new Set(matrixQs.map(q => q.id));
            const remaining = shuffleArr(weekQuestions.filter(q => !usedIds.has(q.id)));
            matrixQs = [...matrixQs, ...remaining].slice(0, 10);
          }
          
          // Sắp xếp độ khó tăng dần
          const diffWeight = { easy: 1, medium: 2, hard: 3 };
          matrixQs.sort((a, b) => (diffWeight[a.difficulty] || 0) - (diffWeight[b.difficulty] || 0));
          questions = matrixQs;
        } else {
          // Chuyên đề nâng cao / dễ / trung bình
          let filtered = weekQuestions.filter(q => q.difficulty === config.difficulty);
          if (filtered.length === 0) filtered = weekQuestions; // fallback
          questions = shuffleArr(filtered).slice(0, 5); // Chọn 5 câu cho chuyên đề
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

      const timeLimit = config.timeLimitSec || Math.max(300, preparedQuestions.length * 75); // 75s per question

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-amber-100">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800">Đang tải dữ liệu bài học...</h2>
          <p className="text-slate-500 mt-2">Vui lòng chờ giây lát (nếu server đang ngủ đông có thể mất khoảng 30s)</p>
        </div>
      </div>
    );
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
      />
        {/* Switch Profile Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex justify-end">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-5 py-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold rounded-full shadow-sm transition-all group"
            title="Đổi tài khoản"
          >
            <div className="text-2xl bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              {profile?.avatar || '🐯'}
            </div>
            <span className="text-lg">{profile?.name || 'Học Sinh'}</span>
            <LogOut className="w-5 h-5 ml-2 text-slate-400 group-hover:text-rose-500" />
          </button>
        </div>

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




import { Users, Lock, LogOut } from 'lucide-react';


const ProfileSelector = ({ onSelect }) => {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('agy_profiles');
      return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Bé Bi', avatar: '🐯' }];
    } catch { return [{ id: 'default', name: 'Bé Bi', avatar: '🐯' }]; }
  });
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐯');
  const avatars = ['🐯', '🐰', '🐼', '🦊', '🐶', '🐱', '🦁', '🐸', '🐵', '🦉'];
  
  const handleAdd = () => {
    if (!newProfileName.trim()) return;
    const newP = {
      id: 'p_' + Date.now(),
      name: newProfileName,
      avatar: selectedAvatar
    };
    const updated = [...profiles, newP];
    setProfiles(updated);
    localStorage.setItem('agy_profiles', JSON.stringify(updated));
    setNewProfileName('');
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border-4 border-amber-300">
        <h1 className="text-3xl font-bold text-amber-600 mb-8">Ai đang học toán thế nhỉ?</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => {
                // Keep global profile up to date
                localStorage.setItem('activeProfileData', JSON.stringify(p));
                onSelect(p.id);
              }}
              className="p-6 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 transition-all flex flex-col items-center gap-3 group"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform">{p.avatar}</div>
              <div className="font-bold text-slate-700 text-lg">{p.name}</div>
            </button>
          ))}
        </div>
        
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
          <h3 className="text-slate-500 font-bold mb-3">Thêm tài khoản mới</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {avatars.map(av => (
              <button 
                key={av} 
                onClick={() => setSelectedAvatar(av)}
                className={`text-2xl p-2 rounded-xl transition-all ${selectedAvatar === av ? 'bg-amber-200 scale-110 ring-2 ring-amber-400' : 'bg-white hover:bg-slate-100'}`}
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
              onChange={(e) => setNewProfileName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 outline-none focus:border-amber-400 font-bold text-slate-700"
            />
            <button 
              onClick={handleAdd}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl transition-all"
            >
              + Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Parent Corner Wrapper
const ProtectedDashboard = () => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { resetProgress } = useLearning();

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-xl border-4 border-slate-200 text-center">
        <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Góc Phụ Huynh</h2>
        <p className="text-slate-500 mb-6 font-semibold">Vui lòng nhập mã PIN (Mặc định: 2026)</p>
        <input 
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full text-center text-3xl tracking-widest px-4 py-3 rounded-xl border-2 border-slate-200 mb-4 focus:border-blue-400 outline-none"
          placeholder="••••"
        />
        <button 
          onClick={() => {
            if (pin === '2026') setIsAuthenticated(true);
            else alert('Mã PIN không đúng!');
          }}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl"
        >
          Xác Nhận
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ParentDashboard />
      <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl text-center">
        <h3 className="text-xl font-bold text-rose-700 mb-2">Cài Đặt Dữ Liệu</h3>
        <p className="text-rose-600/80 text-sm font-semibold mb-6">Xóa toàn bộ điểm số, huy chương và tiến trình của tài khoản hiện tại để bắt đầu lại từ đầu.</p>
        <button 
          onClick={() => {
            if(window.confirm('Bạn có CHẮC CHẮN muốn xóa toàn bộ dữ liệu của bé này không? Không thể khôi phục!')) {
              resetProgress();
            }
          }}
          className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200"
        >
          Xóa Dữ Liệu & Học Lại Từ Đầu
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem('activeProfileId'));

  if (!activeProfileId) {
    return <ProfileSelector onSelect={(id) => {
      localStorage.setItem('activeProfileId', id);
      setActiveProfileId(id);
    }} />;
  }

  return (
    <LearningProvider key={activeProfileId} profileId={activeProfileId}>
      <MainContent 
        onLogout={() => {
          localStorage.removeItem('activeProfileId');
          setActiveProfileId(null);
        }} 
      />
    </LearningProvider>
  );
}


