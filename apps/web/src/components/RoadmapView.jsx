'use client';
import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Star, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Rocket, 
  Target, 
  ChevronRight,
  Filter,
  Flame,
  Award,
  BookOpen,
  Feather
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const RoadmapView = ({ onStartQuiz }) => {
  const { 
    progress, 
    isWeekUnlocked, 
    totalStars, 
    isFreeMode,
    isMath,
    currentGrade,
    isGrade7,
    currentStages,
    currentCategories,
    currentMetadata,
    getQuestionsByWeek
  } = useLearning();

  const [selectedStage, setSelectedStage] = useState('all'); // 'all' | 1 | 2 | 3 | 4
  const [activeWeekModal, setActiveWeekModal] = useState(null);

  const getStageIcon = (iconName) => {
    switch (iconName) {
      case 'Rocket': return <Rocket className="w-6 h-6" />;
      case 'Target': return <Target className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Feather': return <Feather className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCategoryBadge = (catId) => {
    const cat = currentCategories.find(c => c.id === catId);
    if (!cat) return null;
    return (
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cat.color}`}>
        {cat.name}
      </span>
    );
  };

  // Filter stages based on tab
  const displayStages = selectedStage === 'all' 
    ? currentStages 
    : currentStages.filter(s => s.id === Number(selectedStage));

  const handleOpenWeek = (weekNum) => {
    const unlocked = isWeekUnlocked(weekNum);
    if (!unlocked) {
      sounds.playWrong();
      return;
    }
    sounds.playClick();
    setActiveWeekModal(weekNum);
  };

  const handleStartWeekQuiz = (weekNum, difficulty = 'all') => {
    sounds.playClick();
    setActiveWeekModal(null);
    onStartQuiz({
      type: 'week',
      week: weekNum,
      difficulty: difficulty,
      title: `Luyện Tập: Tuần ${weekNum} - ${currentMetadata[weekNum]?.title || ''}`
    });
  };

  // Calculate overall completion
  const completedWeeksCount = Object.keys(progress).filter(w => (progress[w]?.bestScore || 0) >= 70).length;
  const progressPercent = Math.round((completedWeeksCount / 35) * 100);

  const getBannerTitle = () => {
    if (isGrade7) {
      return isMath ? 'Chinh Phục Toán Lớp 3 (GDPT 2018) 🚀' : 'Hành Trình Khám Phá Ngữ Văn Lớp 3 📖';
    }
    return isMath ? 'Chinh Phục Thế Giới Toán Lớp 3 🌟' : 'Hành Trình Khám Phá Tiếng Việt 4 📖';
  };

  const getBannerDesc = () => {
    if (isGrade7) {
      return isMath
        ? 'Làm chủ số hữu tỉ, số thực, đại số và hình học tam giác cùng hơn 350 bài tập phân cấp độ khó lũy tiến!'
        : 'Rèn luyện đọc hiểu thơ văn, làm chủ tiếng Việt và phân tích văn bản cùng 350+ câu hỏi và đề thi chuẩn GDPT mới!';
    }
    return isMath 
      ? 'Hoàn thành mỗi tuần với điểm số trên 75% để mở khóa trạm tiếp theo và thu thập đủ 105 Ngôi Sao Danh Giá!'
      : 'Rèn luyện đọc hiểu cảm thụ, thành thạo ngữ pháp và làm chủ vốn từ phong phú cùng 350+ bài tập đặc sắc!';
  };

  const getBannerGradient = () => {
    if (isGrade7) {
      return isMath
        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600'
        : 'bg-gradient-to-r from-purple-600 via-rose-600 to-indigo-600';
    }
    return isMath
      ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
      : 'bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner with Adventure Stats */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-bouncy ${getBannerGradient()}`}>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-black mb-3">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            Lộ Trình Học Tập Chuẩn 35 Tuần GDPT Mới
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
            {getBannerTitle()}
          </h1>
          <p className="text-sm sm:text-base font-bold text-amber-50 mb-6">
            {getBannerDesc()}
          </p>

          {/* Overall Progress bar */}
          <div className="bg-black/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex justify-between text-xs sm:text-sm font-extrabold mb-1.5">
              <span>Tiến Độ Hành Trình: {completedWeeksCount}/35 Tuần</span>
              <span>{progressPercent}% Hoàn thành</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3.5 overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 text-8xl opacity-20 pointer-events-none select-none">
          {isMath ? '🗺️' : '📚'}
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            sounds.playClick();
            setSelectedStage('all');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
            selectedStage === 'all'
              ? 'bg-slate-800 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          🌟 Tất Cả 4 Chặng (35 Tuần)
        </button>

        {currentStages.map((stage) => {
          const isSelected = selectedStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => {
                sounds.playClick();
                setSelectedStage(stage.id);
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                isSelected
                  ? isMath
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-2 border-slate-200'
              }`}
            >
              <span>Chặng {stage.id}</span>
            </button>
          );
        })}
      </div>

      {/* Roadmap Timeline Stages */}
      <div className="space-y-10">
        {displayStages.map((stage) => {
          const stageWeeks = stage.weeks;
          const stageCompletedWeeks = stageWeeks.filter(w => (progress[w]?.bestScore || 0) >= 70).length;
          const stageProgressPercent = Math.round((stageCompletedWeeks / stageWeeks.length) * 100);

          return (
            <div 
              key={stage.id}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-bouncy p-5 sm:p-7 space-y-6"
            >
              {/* Stage Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.color} text-white flex items-center justify-center shadow-md`}>
                    {getStageIcon(stage.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                        {stage.title}
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {stage.subtitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Stage Badge & Completion */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500">Hoàn thành</div>
                    <div className="text-base font-black text-emerald-600">{stageCompletedWeeks}/{stageWeeks.length} Tuần</div>
                  </div>
                  <div className={`p-3 rounded-2xl border-2 flex items-center gap-2 ${
                    stageProgressPercent === 100 
                      ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-extrabold hidden sm:inline">{stage.badge}</span>
                  </div>
                </div>
              </div>

              {/* Weeks Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageWeeks.map((weekNum) => {
                  const meta = currentMetadata[weekNum] || { title: `Bài học Tuần ${weekNum}`, category: 'grammar' };
                  const weekData = progress[weekNum] || { bestScore: 0, stars: 0, attempts: 0 };
                  const unlocked = isWeekUnlocked(weekNum);
                  const isCompleted = (weekData.bestScore || 0) >= 70;
                  const isPerfect = (weekData.bestScore || 0) === 100;
                  const totalWeekQuestions = getQuestionsByWeek(weekNum).length;

                  return (
                    <div
                      key={weekNum}
                      onClick={() => handleOpenWeek(weekNum)}
                      className={`relative rounded-2xl p-4.5 border-2 transition-all flex flex-col justify-between ${
                        !unlocked
                          ? 'bg-slate-50/70 border-slate-200 opacity-60 cursor-not-allowed'
                          : isPerfect
                          ? 'bg-gradient-to-br from-amber-50/80 to-yellow-50/80 border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400 cursor-pointer group'
                          : isCompleted
                          ? 'bg-emerald-50/40 border-emerald-300 shadow-sm hover:shadow-md hover:border-emerald-400 cursor-pointer group'
                          : 'bg-white border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md cursor-pointer group'
                      }`}
                    >
                      {/* Top Row: Week Badge & Lock/Star */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                              !unlocked 
                                ? 'bg-slate-200 text-slate-600'
                                : isMath
                                ? 'bg-amber-400 text-amber-950 shadow-sm'
                                : 'bg-rose-400 text-white shadow-sm'
                            }`}>
                              Tuần {weekNum}
                            </span>
                            {getCategoryBadge(meta.category)}
                          </div>

                          {/* Lock or Star Icons */}
                          {!unlocked ? (
                            <div className="p-1 rounded-lg bg-slate-200 text-slate-500" title="Chưa mở khóa">
                              <Lock className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((starIdx) => (
                                <Star
                                  key={starIdx}
                                  className={`w-4 h-4 ${
                                    starIdx <= (weekData.stars || 0)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-200 fill-slate-100'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-amber-900 transition-colors line-clamp-2 min-h-[40px]">
                          {meta.title}
                        </h4>
                      </div>

                      {/* Bottom Info & Action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        {unlocked ? (
                          <>
                            <div className="flex items-center gap-2 text-slate-500">
                              <span>{totalWeekQuestions} bài tập</span>
                              {weekData.bestScore > 0 && (
                                <span className={`px-1.5 py-0.5 rounded text-[11px] font-black ${
                                  weekData.bestScore >= 90 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : weekData.bestScore >= 70 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {weekData.bestScore}%
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWeek(weekNum);
                              }}
                              className={`px-3 py-1 font-black rounded-xl shadow-bouncy-sm btn-bouncy flex items-center gap-1 ${
                                isMath
                                  ? 'bg-amber-400 group-hover:bg-amber-500 text-amber-950'
                                  : 'bg-rose-500 group-hover:bg-rose-600 text-white'
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Luyện tập
                            </button>
                          </>
                        ) : (
                          <div className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Cần đạt ≥75% ở Tuần {weekNum - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Detail & Level Selection Modal */}
      {activeWeekModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-lg w-full p-6 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className={`px-3 py-1 font-black text-xs rounded-full inline-block mb-1.5 shadow-sm ${
                  isMath ? 'bg-amber-400 text-amber-950' : 'bg-rose-500 text-white'
                }`}>
                  Trạm Học Tuần {activeWeekModal}
                </span>
                <h3 className="text-xl font-black text-slate-800">
                  {currentMetadata[activeWeekModal]?.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveWeekModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-600 mb-5">
              Chọn mức độ thử thách để bắt đầu luyện tập trắc nghiệm:
            </p>

            {/* Difficulty Options */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleStartWeekQuiz(activeWeekModal, 'all')}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                  isMath
                    ? 'border-amber-400 bg-amber-50/80 hover:bg-amber-100'
                    : 'border-rose-400 bg-rose-50/80 hover:bg-rose-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-black text-base text-slate-800 group-hover:text-amber-800">
                      Đề Chuẩn Trọn Vẹn (Đầy Đủ 10 Câu)
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Gồm 10 bài tập từ Khởi động đến 5 bài Nâng cao tư duy
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleStartWeekQuiz(activeWeekModal, 'hard')}
                className="w-full p-3.5 rounded-2xl border-2 border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔥</span>
                  <div>
                    <div className="font-extrabold text-sm text-purple-900">
                      Chuyên Đề Nâng Cao (5 Bài Khó Điểm 10)
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      Tập trung 5 bài tập tư duy & cảm thụ hóc búa nhất của tuần
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleStartWeekQuiz(activeWeekModal, 'medium')}
                className="w-full p-3.5 rounded-2xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <div>
                    <div className="font-extrabold text-sm text-blue-900">
                      Mức Độ Trung Bình (Thông Hiểu & Thực Hành)
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      Rèn luyện kỹ năng thực hành và vận dụng chuẩn xác
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleStartWeekQuiz(activeWeekModal, 'easy')}
                className="w-full p-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌱</span>
                  <div>
                    <div className="font-extrabold text-sm text-emerald-900">
                      Mức Độ Dễ (Khởi Động & Nhận Biết)
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      Ôn tập kiến thức nền tảng và nhận biết nhanh
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
