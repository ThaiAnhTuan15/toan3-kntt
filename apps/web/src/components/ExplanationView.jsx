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
  Filter
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import sounds from '../utils/soundEffects';

export const ExplanationView = ({ 
  quizTitle, 
  details = [], 
  onBack, 
  onRetryWrongOnly 
}) => {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'wrong' | 'correct'
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingAi, setLoadingAi] = useState({});

  const handleAskAI = async (questionText, correctAnswer, wrongAnswer, questionId) => {
    sounds.playClick();
    setLoadingAi(prev => ({ ...prev, [questionId]: true }));
    try {
      const res = await fetch('https://toan3-kntt.onrender.com/api/analytics/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ questionText, correctAnswer, wrongAnswer })
      });
      const data = await res.json();
      setAiExplanations(prev => ({ ...prev, [questionId]: data.explanation }));
    } catch (e) {
      setAiExplanations(prev => ({ ...prev, [questionId]: 'Oops, Cú Mèo đang bận, em thử lại sau nha!' }));
    } finally {
      setLoadingAi(prev => ({ ...prev, [questionId]: false }));
    }
  };

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
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                Lời Giải & Sửa Bài Chi Tiết
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800">
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
                  <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Mã: {q.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg">
                    {q.topic}
                  </span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                  isCorrect 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                    : 'bg-rose-50 border-rose-300 text-rose-700'
                }`}>
                  {isCorrect ? (
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
              </div>

              {/* Question Content */}
              <div className="text-base sm:text-xl font-extrabold text-slate-800 mb-5 leading-relaxed">
                <MathRenderer text={q.question} />
              </div>

              {/* 4 Options with Status Coloring */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {q.options.map((opt, optIdx) => {
                  const isUserSelection = userChoice === optIdx;
                  const isTargetCorrect = correctChoice === optIdx;

                  let cardStyle = "bg-slate-50/50 border-slate-200 text-slate-600";
                  let letterStyle = "bg-slate-100 text-slate-600 border-slate-200";

                  if (isTargetCorrect) {
                    cardStyle = "bg-emerald-50/90 border-emerald-400 text-emerald-950 font-black ring-2 ring-emerald-300";
                    letterStyle = "bg-emerald-500 text-white font-black";
                  } else if (isUserSelection && !isCorrect) {
                    cardStyle = "bg-rose-50/90 border-rose-400 text-rose-950 font-black ring-2 ring-rose-300";
                    letterStyle = "bg-rose-500 text-white font-black";
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
                      {isTargetCorrect && (
                        <span className="text-[11px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shrink-0">
                          Đáp án đúng ✓
                        </span>
                      )}
                      {isUserSelection && !isTargetCorrect && (
                        <span className="text-[11px] font-black px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full border border-rose-300 shrink-0">
                          Bé đã chọn ✗
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Assistant Box (Only for wrong answers) */}
              {!isCorrect && (
                <div className="mt-4 mb-4 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-black text-indigo-900">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <span>Trợ giảng AI Cú Mèo</span>
                    </div>
                    {!aiExplanations[q.id] && !loadingAi[q.id] && (
                      <button
                        onClick={() => handleAskAI(q.question, q.options[q.correctIndex], q.options[userChoice], q.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                      >
                        Hỏi Cú Mèo ngay
                      </button>
                    )}
                  </div>
                  
                  {loadingAi[q.id] && (
                    <div className="text-sm font-semibold text-indigo-600 animate-pulse flex items-center gap-2 mt-2">
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Cú Mèo đang đọc đề và suy nghĩ...
                    </div>
                  )}
                  
                  {aiExplanations[q.id] && (
                    <div className="text-sm sm:text-base font-semibold text-indigo-800 leading-relaxed bg-white p-3 rounded-xl border border-indigo-100 mt-2">
                      {aiExplanations[q.id]}
                    </div>
                  )}
                </div>
              )}

              {/* Step-by-Step Explanation Box */}
              <div className="rounded-2xl bg-amber-50/70 border-2 border-amber-200 p-4 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm text-amber-900">
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
          );
        })}
      </div>
    </div>
  );
};
