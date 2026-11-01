'use client';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Lightbulb, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  Flag,
  Lock,
  Unlock
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { ReportErrorModal } from './ReportErrorModal';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const ExplanationView = ({ 
  quizTitle, 
  details = [], 
  onBack, 
  onRetryWrongOnly 
}) => {
  const { profile, reportedQuestions, verifiedErrorIds, wrongQuestionAttempts } = useLearning();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'wrong' | 'correct'
  const [reportModalQuestion, setReportModalQuestion] = useState(null);

  const optionLetters = ['A', 'B', 'C', 'D'];
  const wrongCount = details.filter(d => !d.isCorrect).length;
  const correctCount = details.filter(d => d.isCorrect).length;

  const displayQuestions = details.filter(item => {
    if (filterMode === 'wrong') return !item.isCorrect;
    if (filterMode === 'correct') return item.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px] font-black">
                <span>{profile?.avatar || '📖'}</span>
                <span>Bài làm của {profile?.name || 'bé'}</span>
              </span>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Lời Giải & Sửa Bài Chi Tiết
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">
              {quizTitle || "Bài Luyện Tập"}
            </h1>
          </div>
        </div>

        {/* Retry Wrong Button if available */}
        {wrongCount > 0 && onRetryWrongOnly && (
          <button
            onClick={() => { sounds.playClick(); onRetryWrongOnly(); }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-700 font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Luyện Lại {wrongCount} Câu Sai
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { sounds.playClick(); setFilterMode('all'); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tất cả ({details.length})
        </button>
        <button
          onClick={() => { sounds.playClick(); setFilterMode('wrong'); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
            filterMode === 'wrong'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white border text-rose-600 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" /> Chỉ câu sai ({wrongCount})
        </button>
        <button
          onClick={() => { sounds.playClick(); setFilterMode('correct'); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
            filterMode === 'correct'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Chỉ câu đúng ({correctCount})
        </button>
      </div>

      {/* Questions Solution List */}
      <div className="space-y-6">
        {displayQuestions.map((item, index) => {
          const q = item.question;
          const isCorrect = item.isCorrect;
          const userChoice = item.selectedIndex;
          const correctChoice = q.correctIndex;

          return (
            <div
              key={q.id || index}
              className={`bg-white rounded-3xl border-3 p-5 sm:p-7 shadow-sm transition-all ${
                isCorrect ? 'border-emerald-200' : 'border-rose-200'
              }`}
            >
              {/* Question Header & Status */}
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-bold text-sm flex items-center justify-center shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Mã: {q.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg">
                    {q.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    item.isExempt || verifiedErrorIds?.includes(q.id)
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : isCorrect 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                        : 'bg-rose-50 border-rose-300 text-rose-700'
                  }`}>
                    {item.isExempt || verifiedErrorIds?.includes(q.id) ? (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>MIỄN TRỪ (Đã duyệt lỗi)</span>
                      </>
                    ) : isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ĐÚNG (+10 điểm)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>CHƯA ĐÚNG</span>
                      </>
                    )}
                  </div>

                  {/* Nút hoặc Badge Báo Lỗi */}
                  {verifiedErrorIds?.includes(q.id) ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span>🎖️</span> Đã xác nhận lỗi (+5k)
                    </span>
                  ) : reportedQuestions?.some(r => r.questionId === q.id && r.status === 'pending') ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <span>⏳</span> Chờ duyệt lỗi
                    </span>
                  ) : (
                    <button
                      onClick={() => { sounds.playClick(); setReportModalQuestion(q); }}
                      className="px-2.5 py-1 rounded-full text-xs font-bold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition flex items-center gap-1"
                      title="Báo câu hỏi này bị lỗi cho Ba Mẹ (Thưởng 5.000đ)"
                    >
                      <Flag className="w-3.5 h-3.5 text-rose-500" />
                      <span>Báo lỗi 🚩</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Content */}
              <div className="text-base sm:text-xl font-extrabold text-slate-800 mb-5 leading-relaxed">
                <MathRenderer text={q.question} />
              </div>

              {/* Question Illustration Image (if available) */}
              {q.image && (
                <div className="flex justify-center my-3 p-2 bg-slate-50/90 rounded-2xl border border-slate-200 max-w-lg mx-auto mb-5 shadow-sm">
                  <img 
                    src={q.image} 
                    alt="Hình minh họa câu hỏi" 
                    className="max-h-60 max-w-full object-contain rounded-xl hover:scale-105 transition-transform" 
                  />
                </div>
              )}

              {/* 4 Options with Status Coloring */}
              {(() => {
                const qAttempts = wrongQuestionAttempts?.[q.id] || 1;
                const isUnlocked = isCorrect || qAttempts >= 5;

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {q.options.map((opt, optIdx) => {
                        const isUserSelection = userChoice === optIdx;
                        // Only highlight target correct if isUnlocked!
                        const showTargetCorrect = isUnlocked && correctChoice === optIdx;

                        let cardStyle = "bg-slate-50/50 border-slate-200 text-slate-600";
                        let letterStyle = "bg-slate-100 text-slate-600 border-slate-200";

                        if (showTargetCorrect) {
                          cardStyle = "bg-emerald-50/90 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300";
                          letterStyle = "bg-emerald-500 text-white font-bold";
                        } else if (isUserSelection && !isCorrect) {
                          cardStyle = "bg-rose-50/90 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-300";
                          letterStyle = "bg-rose-500 text-white font-bold";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${cardStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${letterStyle}`}>
                                {optionLetters[optIdx]}
                              </span>
                              <span className="text-sm sm:text-base font-bold">
                                <MathRenderer text={opt} />
                              </span>
                            </div>

                            {/* Indicator tag */}
                            {showTargetCorrect && (
                              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shrink-0">
                                Đáp án đúng ✓
                              </span>
                            )}
                            {isUserSelection && !showTargetCorrect && (
                              <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full border border-rose-300 shrink-0 inline-flex items-center gap-1">
                                <span>{profile?.avatar || '✗'}</span>
                                <span>{profile?.name || 'Bé'} đã chọn ✗ {!isUnlocked && '(Chưa đúng)'}</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-Step Explanation Box (Chỉ hiện khi bé đã làm đúng hoặc đã thử sức >= 5 lần) */}
                    {!isUnlocked ? (
                      <div className="rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-4 sm:p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                          <div className="flex items-center gap-2 font-black text-sm sm:text-base text-amber-900">
                            <Lock className="w-5 h-5 text-amber-600" />
                            <span>Thử Thách Tự Tư Duy: Lời Giải Chi Tiết Đang Tạm Ẩn</span>
                          </div>
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                            Đã thử sức: {qAttempts}/5 lần
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                          Để rèn luyện tư duy thực chất và tránh học vẹt, hệ thống tạm ẩn đáp án đúng và lời giải chi tiết. 
                          Bé hãy lấy giấy nháp tự tính lại và chọn <strong>&quot;Luyện Tập Lại Câu Sai&quot;</strong> để chinh phục nhé!
                        </p>

                        {q.hint && (
                          <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold text-amber-900 flex items-start gap-2 shadow-2xs">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold text-amber-800">Gợi ý tư duy: </span>
                              <MathRenderer text={q.hint} />
                            </div>
                          </div>
                        )}

                        <div className="text-[11px] font-bold text-slate-500 italic">
                          💡 Lời giải đầy đủ và đáp án chính xác sẽ tự động mở khóa sau 5 lần bé kiên trì tự thử sức!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {!isCorrect && qAttempts >= 5 && (
                          <div className="rounded-xl bg-emerald-50 border border-emerald-300 px-3.5 py-2 flex items-center justify-between gap-2 text-emerald-800 text-xs font-black">
                            <div className="flex items-center gap-1.5">
                              <Unlock className="w-4 h-4 text-emerald-600" />
                              <span>Đã mở khóa lời giải chi tiết (Bé đã kiên trì thử sức {qAttempts} lần)!</span>
                            </div>
                            <span className="bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md">≥ 5 lần thử</span>
                          </div>
                        )}
                        <div className="rounded-2xl bg-amber-50/70 border-2 border-amber-200 p-4 space-y-2">
                          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                            <Lightbulb className="w-5 h-5 text-amber-600" />
                            <span>Hướng dẫn giải chi tiết từng bước:</span>
                          </div>
                          <div className="text-sm sm:text-base font-semibold text-slate-700 pl-7 leading-relaxed">
                            <MathRenderer text={q.explanation} />
                          </div>
                          {q.hint && (
                            <div className="text-xs font-bold text-amber-700 pl-7 pt-1">
                              📌 <em>Mẹo nhớ nhanh: {q.hint}</em>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Report Error Modal */}
      {reportModalQuestion && (
        <ReportErrorModal
          question={reportModalQuestion}
          onClose={() => setReportModalQuestion(null)}
        />
      )}
    </div>
  );
};

