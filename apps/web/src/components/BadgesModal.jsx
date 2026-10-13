'use client';
import React, { useState } from 'react';
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
  Target,
  Rocket,
  Compass,
  TrendingUp,
  Coins,
  Search,
  CheckCircle,
  Trophy
} from 'lucide-react';
import { BADGE_DEFINITIONS, useLearning } from '../context/LearningContext';

const CATEGORIES = [
  { id: 'all', label: 'Tất Cả', icon: '🌟' },
  { id: 'accuracy', label: 'Điểm Số & Độ Chuẩn', icon: '🎯' },
  { id: 'stage', label: '6 Chặng Toán 3', icon: '🚀' },
  { id: 'milestone', label: 'Cột Mốc Đề Thi', icon: '📈' },
  { id: 'star', label: 'Ngôi Sao Tri Thức', icon: '⭐' },
  { id: 'piggy', label: 'Heo Đất & Xu', icon: '🐷' },
  { id: 'streak', label: 'Chăm Chỉ & Rèn Luyện', icon: '🔥' },
];

export const BadgesModal = () => {
  const { unlockedBadges, totalStars, coins, piggyBalance } = useLearning();
  const [activeCategory, setActiveCategory] = useState('all');

  const getBadgeIcon = (iconName, isUnlocked) => {
    const props = { className: `w-7 h-7 ${isUnlocked ? 'text-amber-950' : 'text-slate-400'}` };
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
      case 'Target': return <Target {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'Search': return <Search {...props} />;
      default: return <Award {...props} />;
    }
  };

  const filteredBadges = BADGE_DEFINITIONS.filter(b => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const percentUnlocked = Math.round((unlockedBadges.length / BADGE_DEFINITIONS.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl p-6 sm:p-8 text-white shadow-bouncy">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-flex items-center gap-1 text-amber-950">
              <Trophy className="w-3.5 h-3.5" /> Phòng Truyền Thống & Vinh Danh
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mb-1.5 text-slate-900 font-nunito">
              Bộ Sưu Tập Huy Hiệu Toán Lớp 3 🏆
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
              Chinh phục 66 đề thi, tích lũy điểm 10, ngôi sao và Heo Đất Tri Thức để mở khóa toàn bộ {BADGE_DEFINITIONS.length} huy hiệu danh giá!
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/50 text-center shrink-0 shadow-xs">
            <div className="text-[11px] font-black text-amber-950 uppercase tracking-wider">ĐÃ MỞ KHÓA</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {unlockedBadges.length} <span className="text-sm font-bold text-amber-900">/ {BADGE_DEFINITIONS.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-black text-amber-950 mb-1.5">
            <span>Tiến độ hoàn thành bộ sưu tập</span>
            <span>{percentUnlocked}%</span>
          </div>
          <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${percentUnlocked}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => {
          const countInCat = cat.id === 'all' 
            ? BADGE_DEFINITIONS.length 
            : BADGE_DEFINITIONS.filter(b => b.category === cat.id).length;
          const unlockedInCat = cat.id === 'all'
            ? unlockedBadges.length
            : BADGE_DEFINITIONS.filter(b => b.category === cat.id && unlockedBadges.includes(b.id)).length;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-amber-950 shadow-xs scale-102'
                  : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-amber-500/30 text-amber-950' : 'bg-slate-100 text-slate-500'
              }`}>
                {unlockedInCat}/{countInCat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl border-2 p-4 sm:p-5 flex items-start gap-3.5 transition-all relative overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50/90 via-yellow-50/50 to-white border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400'
                  : 'bg-slate-50/80 border-slate-200 opacity-65'
              }`}
            >
              {/* Badge Icon Circle */}
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                isUnlocked 
                  ? `bg-gradient-to-br ${badge.color || 'from-amber-400 to-yellow-400'}` 
                  : 'bg-slate-200'
              }`}>
                {getBadgeIcon(badge.icon, isUnlocked)}
              </div>

              {/* Badge Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className={`font-black text-sm sm:text-base truncate ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                    {badge.name}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-slate-500 leading-snug mb-2.5 line-clamp-2">
                  {badge.desc}
                </p>

                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Đã Vinh Danh ✨
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    <Lock className="w-3 h-3" /> Chưa Đạt Được
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
