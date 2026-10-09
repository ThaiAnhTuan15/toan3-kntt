'use client';
import React from 'react';
import { 
  Award, 
  Lock, 
  Sparkles, 
  Footprints, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Flame, 
  Star,
  BookOpen,
  Feather
} from 'lucide-react';
import { BADGE_DEFINITIONS, useLearning } from '../context/LearningContext';

export const BadgesModal = () => {
  const { unlockedBadges, totalStars, coins } = useLearning();

  const getBadgeIcon = (iconName, isUnlocked) => {
    const props = { className: `w-8 h-8 ${isUnlocked ? 'text-amber-950' : 'text-slate-400'}` };
    switch (iconName) {
      case 'Footprints': return <Footprints {...props} />;
      case 'Award': return <Award {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Star': return <Star {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Feather': return <Feather {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl p-6 sm:p-8 text-white shadow-bouncy">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block">
              Phòng Truyền Thống & Danh Hiệu
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mb-1 text-slate-900">
              Bộ Sưu Tập Huy Hiệu Danh Giá 🏆
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-950">
              Tích lũy điểm số và vượt qua các thử thách Toán & Tiếng Việt để mở khóa toàn bộ {BADGE_DEFINITIONS.length} danh hiệu cao quý!
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/40 text-center">
            <div className="text-xs font-black text-amber-950">ĐÃ MỞ KHÓA</div>
            <div className="text-2xl font-black text-slate-900">
              {unlockedBadges.length} / {BADGE_DEFINITIONS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BADGE_DEFINITIONS.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl border-3 p-5 flex items-start gap-4 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-100/60 border-amber-300 shadow-bouncy-sm'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              {/* Badge Icon Circle */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-400' 
                  : 'bg-slate-200'
              }`}>
                {getBadgeIcon(badge.icon, isUnlocked)}
              </div>

              {/* Badge Info */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className={`font-black text-base ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                    {badge.name}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-slate-500 leading-snug mb-2">
                  {badge.desc}
                </p>

                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Đã đạt được
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3" /> Chưa mở khóa
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
