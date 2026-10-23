'use client';
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Star, 
  Trophy, 
  RotateCcw, 
  BookOpen, 
  Home, 
  Coins, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import sounds from '../utils/soundEffects';
import { useLearning } from '../context/LearningContext';

export const ResultModal = ({
  resultData,
  earnedRewards,
  onOpenExplanations,
  onRetryQuiz,
  onRetryWrongOnly,
  onBackToRoadmap
}) => {
  const { profile } = useLearning();
  const kidName = profile?.name || 'Bé';
  const kidAvatar = profile?.avatar || '⭐';
  const { score, correctCount, totalCount, timeSpent, details } = resultData;
  const { earnedStars, earnedCoins, earnedMoney, stageReward, finalReward } = earnedRewards || { earnedStars: 0, earnedCoins: 0, earnedMoney: 0 };

  useEffect(() => {
    if (score >= 80) {
      sounds.playVictory();
      // Multi-stage confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      } catch (e) {
        console.error(e);
      }
    } else {
      sounds.playCorrect();
    }
  }, [score]);

  // Format time spent (MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins} phút ${s} giây`;
  };

  // Praise title & mascot message
  let title = `Cố Gắng Lên Nào ${kidName} Ơi! 💪`;
  let message = `Đừng buồn nhé ${kidName}! Hãy xem lại lời giải chi tiết để hiểu bài hơn và thử lại nhé!`;
  let badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
  let emoji = "🌱";

  if (score === 100) {
    title = `Tuyệt Đỉnh Thần Đồng Toán Học! 🌟`;
    message = `${kidName} đã xuất sắc trả lời chính xác 100% tất cả các câu hỏi! Quá đỉnh!`;
    badgeColor = "bg-yellow-100 text-yellow-900 border-yellow-400";
    emoji = "👑";
  } else if (score >= 80) {
    title = `Xuất Sắc Quá Đi Thôi, ${kidName}! 🎉`;
    message = `Kết quả rất tuyệt vời! ${kidName} đã nắm vững trọn vẹn kiến thức trọng tâm!`;
    badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-400";
    emoji = "🎖️";
  } else if (score >= 50) {
    title = `Chiến Binh Chăm Chỉ ${kidName}! 👏`;
    message = `${kidName} đã vượt qua bài thi! Hãy tiếp tục rèn luyện để bứt phá điểm 10 nhé!`;
    badgeColor = "bg-blue-100 text-blue-900 border-blue-400";
    emoji = "⭐";
  }

  const wrongCount = totalCount - correctCount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center my-auto animate-scale-in">
        {/* Mascot / Trophy Icon */}
        <div className="flex flex-col items-center mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-900 font-black text-xs sm:text-sm mb-3 shadow-xs">
            <span className="text-xl sm:text-2xl">{kidAvatar}</span>
            <span>{kidName}</span>
          </div>
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 flex items-center justify-center text-4xl sm:text-5xl shadow-bouncy mx-auto">
              {emoji}
            </div>
            {score >= 80 && (
              <div className="absolute -top-2 -right-2 p-1.5 bg-yellow-300 rounded-full border-2 border-white shadow-sm animate-spin-slow">
                <Sparkles className="w-5 h-5 text-amber-900" />
              </div>
            )}
          </div>
        </div>

        {/* Title & Feedback */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 font-nunito">
          {title}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-sm mx-auto mb-5">
          {message}
        </p>

        {/* Big Score Card */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-200 p-4 sm:p-5 mb-5 shadow-sm">
          {/* Star Rating Animation */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`p-2 rounded-2xl border-2 transition-all ${
                  starIdx <= earnedStars
                    ? 'bg-amber-400 border-amber-500 shadow-bouncy-sm scale-110'
                    : 'bg-slate-100 border-slate-200 opacity-40'
                }`}
              >
                <Star className={`w-6 h-6 sm:w-8 sm:h-8 ${starIdx <= earnedStars ? 'text-amber-950 fill-amber-950' : 'text-slate-400'}`} />
              </div>
            ))}
          </div>

          {/* Numerical Score */}
          <div className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">
            {Math.round((score / 10) * 10) / 10} <span className="text-lg text-slate-500 font-bold">/ 10 Điểm</span>
          </div>
          <div className="text-xs font-bold text-amber-700">
            Tỉ lệ chính xác: {score}%
          </div>

          {/* Sub Stats: Coins & Money & Time */}
          <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-amber-200/60 text-xs font-extrabold">
            <div className="bg-white/80 p-1.5 sm:p-2 rounded-xl border border-amber-200">
              <div className="text-slate-400 font-bold text-[9px] sm:text-[10px]">Đúng</div>
              <div className="text-emerald-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> {correctCount}/{totalCount}
              </div>
            </div>
            <div className="bg-white/80 p-1.5 sm:p-2 rounded-xl border border-amber-200">
              <div className="text-slate-400 font-bold text-[9px] sm:text-[10px]">Thưởng Xu</div>
              <div className="text-yellow-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-0.5">
                <Coins className="w-3 h-3" /> +{earnedCoins}
              </div>
            </div>
            <div className="bg-rose-50/90 p-1.5 sm:p-2 rounded-xl border border-rose-300">
              <div className="text-rose-600 font-black text-[9px] sm:text-[10px]">Heo Đất 🐷</div>
              <div className="text-rose-700 text-xs sm:text-sm font-black flex items-center justify-center gap-0.5">
                +{Number(earnedMoney || 0).toLocaleString('vi-VN')}đ
              </div>
            </div>
            <div className="bg-white/80 p-1.5 sm:p-2 rounded-xl border border-amber-200">
              <div className="text-slate-400 font-bold text-[9px] sm:text-[10px]">Thời gian</div>
              <div className="text-blue-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-0.5">
                <Clock className="w-3 h-3" /> {timeSpent}s
              </div>
            </div>
          </div>

          {/* Stage Completion Bonus Banner */}
          {stageReward && (
            <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-sm text-center animate-bounce-subtle">
              <div className="text-[11px] uppercase font-extrabold text-emerald-100">🎉 Xuất Sắc Vượt Chặng!</div>
              <div className="text-base sm:text-lg font-black mt-0.5">Thưởng Nóng Heo Đất: +{stageReward.amount.toLocaleString('vi-VN')} đ 🏆</div>
            </div>
          )}

          {/* Final Scholarship Bonus Banner */}
          {finalReward && (
            <div className="mt-3 p-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-md text-center animate-pulse">
              <div className="text-[11px] uppercase font-extrabold text-indigo-100">🎓 Thần Đồng Toàn Khóa HK1!</div>
              <div className="text-lg sm:text-xl font-black mt-0.5">Học Bổng Xuất Sắc: +{finalReward.amount.toLocaleString('vi-VN')} đ 👑</div>
            </div>
          )}
        </div>

        {/* Action Buttons Stack */}
        <div className="space-y-2.5">
          {/* View Detailed Solutions */}
          <button
            onClick={() => { sounds.playClick(); onOpenExplanations(); }}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-base rounded-2xl shadow-bouncy-sm btn-bouncy flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Xem Lời Giải Chi Tiết & Sửa Lỗi
          </button>

          {/* Retry Wrong Questions (if any) */}
          {wrongCount > 0 && (
            <button
              onClick={() => { sounds.playClick(); onRetryWrongOnly(); }}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Luyện Tập Lại {wrongCount} Câu Làm Sai
            </button>
          )}

          {/* Re-do Entire Quiz & Back to Roadmap */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { sounds.playClick(); onRetryQuiz(); }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại bài
            </button>
            <button
              onClick={() => { sounds.playClick(); onBackToRoadmap(); }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              Về Lộ Trình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

