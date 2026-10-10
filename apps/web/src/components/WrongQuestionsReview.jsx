'use client';
import React from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Play, 
  BookOpen, 
  Lightbulb,
  Heart
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const WrongQuestionsReview = ({ onStartQuiz }) => {
  const { wrongQuestions } = useLearning();

  const handleStartReviewQuiz = () => {
    sounds.playClick();
    if (wrongQuestions.length === 0) return;
    onStartQuiz({
      type: 'wrong_review',
      title: `Luyện Tập Sửa Câu Sai (${wrongQuestions.length} câu)`,
      questions: [...wrongQuestions],
      timeLimitSec: wrongQuestions.length * 90 // 1.5 min per question
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 rounded-3xl p-6 sm:p-8 text-white shadow-bouncy">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              Kho Luyện Tập Phục Hồi Kiến Thức
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Phòng Sửa Câu Sai & Khắc Phục Lỗ Hổng 🔄
            </h1>
            <p className="text-xs sm:text-sm font-bold text-rose-50">
              Làm lại các câu hỏi bé đã từng chọn chưa đúng để hiểu sâu bản chất và không bị lặp lại lỗi sai nhé!
            </p>
          </div>

          {wrongQuestions.length > 0 && (
            <button
              onClick={handleStartReviewQuiz}
              className="px-6 py-3.5 bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm sm:text-base rounded-2xl shadow-bouncy btn-bouncy flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-rose-600" />
              Luyện Lại Tất Cả ({wrongQuestions.length})
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {wrongQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl border-3 border-emerald-200 p-10 text-center shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Không Có Câu Sai Nào!
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Bé học rất giỏi và đã làm chủ tất cả các câu hỏi vừa qua! Hãy tiếp tục phát huy ở các chặng tiếp theo nhé!
          </p>
        </div>
      ) : (
        /* List of Wrong Questions */
        <div className="space-y-4">
          <div className="flex items-center justify-between font-bold text-xs text-slate-500 px-2">
            <span>Danh sách {wrongQuestions.length} câu cần củng cố:</span>
            <span>Tự động gỡ bỏ khi bé làm đúng lại</span>
          </div>

          {wrongQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-white rounded-3xl border-2 border-rose-200 p-5 sm:p-6 shadow-sm space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Tuần {q.week} • {q.topic}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                  Cần luyện lại
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-extrabold text-slate-800">
                <MathRenderer text={q.question} />
              </div>

              {/* Hint & Formula */}
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-xs sm:text-sm font-semibold text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-800">Gợi ý cách làm: </span>
                  <MathRenderer text={q.explanation || q.hint} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

