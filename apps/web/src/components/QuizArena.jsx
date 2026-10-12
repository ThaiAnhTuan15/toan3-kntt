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
  Volume2,
  ZoomIn
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { Scratchpad } from './Scratchpad';
import { ReportErrorModal } from './ReportErrorModal';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const QuizArena = ({ 
  title, 
  questions = [], 
  timeLimitSec = 900, // 15 mins default
  onFinishQuiz,
  onExitQuiz 
}) => {
  const { reportedQuestions, verifiedErrorIds } = useLearning();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: selectedOptionIndex }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [timeLeft, setTimeLeft] = useState(timeLimitSec);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [reportModalQuestion, setReportModalQuestion] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

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
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-4 space-y-3 sm:space-y-4">
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

            {/* Nút Báo Lỗi Cho Ba Mẹ */}
            <button
              onClick={() => { sounds.playClick(); setReportModalQuestion(currentQuestion); }}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
                verifiedErrorIds?.includes(currentQuestion.id)
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : reportedQuestions?.some(r => r.questionId === currentQuestion.id && r.status === 'pending')
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              }`}
              title="Báo câu hỏi bị lỗi cho Ba Mẹ để nhận thưởng 5.000đ"
            >
              <Flag className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">
                {verifiedErrorIds?.includes(currentQuestion.id)
                  ? 'Lỗi đã duyệt (+5k)'
                  : reportedQuestions?.some(r => r.questionId === currentQuestion.id && r.status === 'pending')
                  ? 'Đã báo lỗi ⏳'
                  : 'Báo lỗi 🚩'}
              </span>
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

        {/* Content Body: Responsive 2 columns on lg screens when image is present */}
        {currentQuestion.image ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start space-y-4 lg:space-y-0">
            {/* Left Column: Question Text + Image */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-base sm:text-lg font-extrabold text-slate-800 leading-relaxed font-nunito">
                <MathRenderer text={currentQuestion.question} />
              </div>

              {/* Illustration Image with Zoom Lightbox */}
              <div 
                className="relative group flex justify-center p-2 bg-slate-50/90 hover:bg-amber-50/40 rounded-2xl border-2 border-slate-100 hover:border-amber-300 shadow-xs cursor-zoom-in transition-all"
                onClick={() => setZoomImage(currentQuestion.image)}
                title="Bấm vào để phóng to hình ảnh"
              >
                <img 
                  src={currentQuestion.image} 
                  alt="Hình minh họa câu hỏi" 
                  className="max-h-48 sm:max-h-56 max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-200" 
                />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/75 group-hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-xs transition-colors shadow-sm">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Phóng to</span>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Options stacked cleanly */}
            <div className="lg:col-span-6 space-y-2.5">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 group ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-500 shadow-bouncy-sm ring-2 ring-amber-400/50 scale-[1.01]'
                        : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white border-2 border-slate-300 text-slate-600 group-hover:border-amber-400'
                    }`}>
                      {optionLetters[optIdx]}
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                      <MathRenderer text={opt} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-base sm:text-xl font-extrabold text-slate-800 leading-relaxed font-nunito">
              <MathRenderer text={currentQuestion.question} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 group ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-500 shadow-bouncy-sm ring-2 ring-amber-400/50 scale-[1.01]'
                        : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white border-2 border-slate-300 text-slate-600 group-hover:border-amber-400'
                    }`}>
                      {optionLetters[optIdx]}
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                      <MathRenderer text={opt} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation & Jump Bar */}
      <div className="sticky bottom-2 sm:bottom-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-300 p-2 sm:p-2.5 shadow-xl flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-3 sm:px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1 transition-all shrink-0 ${
            currentIndex === 0
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Câu trước</span>
        </button>

        {/* Scrollable Question Number Dots (1..15) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 max-w-[55vw] sm:max-w-md mx-auto">
          {questions.map((_, qIdx) => {
            const isAnswered = answers[qIdx] !== undefined;
            const isCurrent = currentIndex === qIdx;
            const isFlagged = flagged[qIdx];

            return (
              <button
                key={qIdx}
                onClick={() => handleJumpTo(qIdx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs shrink-0 relative transition-all ${
                  isCurrent
                    ? 'ring-2 ring-amber-500 ring-offset-1 scale-110 z-10'
                    : ''
                } ${
                  isAnswered
                    ? 'bg-amber-400 text-amber-950 font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`Câu ${qIdx + 1}${isAnswered ? ' (Đã chọn)' : ''}`}
              >
                {qIdx + 1}
                {isFlagged && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next / Submit Button */}
        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            className="px-3 sm:px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs sm:text-sm rounded-xl shadow-bouncy-sm btn-bouncy flex items-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline">Câu tiếp</span>
            <span className="sm:hidden">Tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => handleSubmit(false)}
            className="px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-bouncy-sm btn-bouncy flex items-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline">Nộp bài</span>
            <span className="sm:hidden">Nộp</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
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

      {/* Report Error Modal */}
      {reportModalQuestion && (
        <ReportErrorModal
          question={reportModalQuestion}
          onClose={() => setReportModalQuestion(null)}
        />
      )}

      {/* Image Zoom Lightbox Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border-4 border-amber-300 flex flex-col items-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setZoomImage(null)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg font-bold text-xl transition-transform hover:scale-110 z-10"
              title="Đóng phóng to"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-auto max-h-[75vh] w-full flex items-center justify-center p-2">
              <img 
                src={zoomImage} 
                alt="Hình minh họa phóng to" 
                className="max-h-[72vh] max-w-full object-contain rounded-xl select-none"
              />
            </div>
            <div className="text-center text-xs sm:text-sm font-bold text-slate-600 mt-2 flex items-center gap-2">
              <span>🔍 Bấm nút [✕] hoặc bấm bên ngoài để thu nhỏ lại</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

