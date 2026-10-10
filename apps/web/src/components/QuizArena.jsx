'use client';
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  X,
  Volume2
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { Scratchpad } from './Scratchpad';
import sounds from '../utils/soundEffects';

export const QuizArena = ({ 
  title, 
  questions = [], 
  timeLimitSec = 900, // 15 mins default
  onFinishQuiz,
  onExitQuiz 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: selectedOptionIndex }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [timeLeft, setTimeLeft] = useState(timeLimitSec);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true); // Auto submit when time is up
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Format time (MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex) => {
    sounds.playSelect();
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optIndex
    }));
  };

  const handleToggleFlag = () => {
    sounds.playClick();
    setFlagged(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sounds.playClick();
      setCurrentIndex(currentIndex - 1);
      setShowHint(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      sounds.playClick();
      setCurrentIndex(currentIndex + 1);
      setShowHint(false);
    }
  };

  const handleJumpTo = (index) => {
    sounds.playClick();
    setCurrentIndex(index);
    setShowHint(false);
  };

  const handleSubmit = (force = false) => {
    if (!force && answeredCount < totalQuestions && !showConfirmSubmit) {
      sounds.playWrong();
      setShowConfirmSubmit(true);
      return;
    }

    sounds.playClick();
    setShowConfirmSubmit(false);

    // Compute results
    let correctCount = 0;
    const details = questions.map((q, idx) => {
      const selectedIndex = answers[idx] !== undefined ? answers[idx] : null;
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        question: q,
        selectedIndex,
        isCorrect
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const timeSpent = timeLimitSec - timeLeft;

    onFinishQuiz({
      score,
      correctCount,
      totalCount: totalQuestions,
      details,
      timeSpent
    });
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const isTimeCritical = timeLeft <= 120; // < 2 mins

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Top Bar: Navigation, Title & Floating Scratchpad / Timer */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { sounds.playClick(); onExitQuiz(); }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Thoát bài làm"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-800 line-clamp-1">
              {title}
            </h2>
            <div className="text-xs font-bold text-slate-500">
              Đã làm: <span className="text-amber-600">{answeredCount}/{totalQuestions} câu</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Scratchpad Toggle Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsScratchpadOpen(!isScratchpadOpen);
            }}
            className={`px-3 py-1.5 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isScratchpadOpen 
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm' 
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Bảng Nháp</span>
          </button>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-bold text-xs sm:text-sm ${
            isTimeCritical 
              ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse' 
              : 'bg-blue-50 border-blue-300 text-blue-800'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit(false)}
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-bouncy-sm btn-bouncy"
          >
            Nộp Bài
          </button>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-amber-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 p-5 sm:p-8 shadow-bouncy space-y-6">
        {/* Question Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-bold text-sm flex items-center justify-center shadow-sm">
              {currentIndex + 1}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Câu hỏi {currentIndex + 1} / {totalQuestions}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              currentQuestion.difficulty === 'easy' 
                ? 'bg-emerald-100 text-emerald-800' 
                : currentQuestion.difficulty === 'medium'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {currentQuestion.difficulty === 'easy' ? 'Dễ' : currentQuestion.difficulty === 'medium' ? 'Trung bình' : 'Nâng cao'}
            </span>
          </div>

          {/* Flag & Hint Tools */}
          <div className="flex items-center gap-2">
            {currentQuestion.hint && (
              <button
                onClick={() => { sounds.playClick(); setShowHint(!showHint); }}
                className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
                  showHint 
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Xem gợi ý"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Gợi ý</span>
              </button>
            )}

            <button
              onClick={handleToggleFlag}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
                flagged[currentIndex] 
                  ? 'bg-rose-100 border-rose-300 text-rose-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
              }`}
              title="Đánh dấu câu hỏi cần xem lại"
            >
              <Flag className={`w-4 h-4 ${flagged[currentIndex] ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{flagged[currentIndex] ? 'Đã cắm cờ' : 'Cắm cờ'}</span>
            </button>
          </div>
        </div>

        {/* Hint Box (if toggled) */}
        {showHint && currentQuestion.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-sm font-semibold flex items-start gap-2 animate-fade-in">
            <span className="text-xl">💡</span>
            <div>
              <span className="font-extrabold text-amber-800">Gợi ý dành cho bé: </span>
              {currentQuestion.hint}
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="text-lg sm:text-2xl font-extrabold text-slate-800 leading-relaxed font-nunito">
          <MathRenderer text={currentQuestion.question} />
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = answers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 group ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-500 shadow-bouncy-sm ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                }`}
              >
                {/* Letter Circle (A, B, C, D) */}
                <span className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border-2 border-slate-300 text-slate-600 group-hover:border-amber-400'
                }`}>
                  {optionLetters[optIdx]}
                </span>

                {/* Option Content with Math Rendering */}
                <div className="text-base sm:text-lg font-bold text-slate-800">
                  <MathRenderer text={opt} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Bar: Prev / Next Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-1.5 transition-all ${
              currentIndex === 0
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Câu trước
          </button>

          <div className="text-xs font-extrabold text-slate-400 hidden sm:block">
            Sử dụng bảng nháp để tính nhẩm nếu cần
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm rounded-2xl shadow-bouncy-sm btn-bouncy flex items-center gap-1.5"
            >
              Câu tiếp theo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-bouncy-sm btn-bouncy flex items-center gap-1.5"
            >
              Hoàn thành & Nộp bài
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Jump Palette (1, 2, 3, 4, 5, ...) */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
        <div className="text-xs font-bold text-slate-500 mb-2.5 flex items-center justify-between">
          <span>Danh sách câu hỏi:</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"/> Đã chọn</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"/> Cắm cờ</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"/> Chưa làm</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((_, qIdx) => {
            const isAnswered = answers[qIdx] !== undefined;
            const isCurrent = currentIndex === qIdx;
            const isFlagged = flagged[qIdx];

            return (
              <button
                key={qIdx}
                onClick={() => handleJumpTo(qIdx)}
                className={`w-9 h-9 rounded-xl font-bold text-xs relative transition-all ${
                  isCurrent
                    ? 'ring-2 ring-amber-500 ring-offset-2 scale-110 z-10'
                    : ''
                } ${
                  isAnswered
                    ? 'bg-amber-400 text-amber-950 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {qIdx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scratchpad Floating Canvas Component */}
      <Scratchpad 
        isOpen={isScratchpadOpen} 
        onClose={() => setIsScratchpadOpen(false)} 
      />

      {/* Confirm Incomplete Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-3">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Bé Chưa Làm Hết Bài!
            </h3>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Bé còn <span className="text-rose-600 font-extrabold">{totalQuestions - answeredCount} câu</span> chưa trả lời. Bé có chắc chắn muốn nộp bài ngay bây giờ không?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
              >
                Làm tiếp
              </button>
              <button
                onClick={() => handleSubmit(true)}
                className="py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm shadow-sm"
              >
                Vẫn nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

