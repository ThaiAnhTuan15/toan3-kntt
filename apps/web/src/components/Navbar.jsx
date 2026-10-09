'use client';
import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  RotateCcw, 
  BarChart3, 
  Award, 
  Volume2, 
  VolumeX, 
  Flame, 
  Star, 
  Coins, 
  Unlock, 
  Lock,
  User,
  Sparkles,
  Check,
  Calculator,
  BookMarked,
  GraduationCap
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

const MASCOTS = [
  { id: 'elephant', name: 'Bé Voi Dũng Cảm', emoji: '🐘', desc: 'Siêu trí nhớ & Kiên trì' },
  { id: 'owl', name: 'Cú Mèo Thông Thái', emoji: '🦉', desc: 'Bậc thầy tính nhẩm & Ngữ pháp' },
  { id: 'squirrel', name: 'Sóc Con Nhanh Nhẹn', emoji: '🐿️', desc: 'Nhanh mắt nhanh tay' },
  { id: 'cat', name: 'Mèo Miu Đáng Yêu', emoji: '🐱', desc: 'Chăm chỉ mỗi ngày' },
];

export const Navbar = ({ currentTab, onSelectTab }) => {
  const { 
    currentGrade,
    switchGrade,
    isGrade7,
    currentSubject,
    switchSubject,
    isMath,
    profile, 
    updateProfile,
    totalStars, 
    coins, 
    streakData, 
    wrongQuestions, 
    soundEnabled, 
    toggleSound, 
    isFreeMode, 
    toggleFreeMode 
  } = useLearning();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempMascot, setTempMascot] = useState(profile.mascot);

  const currentMascotObj = MASCOTS.find(m => m.id === profile.mascot) || MASCOTS[0];

  const handleSaveProfile = () => {
    sounds.playClick();
    updateProfile({
      name: tempName.trim() || 'Học Sinh Chăm Chỉ',
      mascot: tempMascot
    });
    setShowProfileModal(false);
  };

  const navItems = [
    { id: 'roadmap', label: 'Lộ Trình 35 Tuần', icon: Compass, badge: null },
    { id: 'practice', label: 'Phòng Luyện Thi', icon: BookOpen, badge: null },
    { id: 'wrong', label: 'Sửa Câu Sai', icon: RotateCcw, badge: wrongQuestions.length > 0 ? wrongQuestions.length : null },
    { id: 'dashboard', label: 'Góc Phụ Huynh', icon: BarChart3, badge: null },
    { id: 'badges', label: 'Bộ Sưu Tập', icon: Award, badge: null },
  ];

  // Dynamic titles
  const getSubjectTitle = () => {
    if (isGrade7) {
      return isMath ? 'Toán Lớp 7' : 'Ngữ Văn 7';
    }
    return isMath ? 'Toán Lớp 4' : 'Tiếng Việt 4';
  };

  const getSubjectSubtitle = () => {
    if (isGrade7) {
      return isMath ? 'Chinh Phục Đại Số & Hình Học 🚀' : 'Khám Phá Văn Học & Tiếng Việt 7 📖';
    }
    return isMath ? 'Phiêu Lưu Ký Toán Học 🚀' : 'Hành Trình Khám Phá Tiếng Việt 📖';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      {/* Top Banner with Switchers, Stats & Profile */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div 
          onClick={() => { sounds.playClick(); onSelectTab('roadmap'); }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-bouncy-sm group-hover:scale-105 transition-transform ${
            isMath 
              ? (isGrade7 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-amber-400 to-orange-500') 
              : (isGrade7 ? 'bg-gradient-to-br from-rose-500 to-purple-600' : 'bg-gradient-to-br from-rose-400 to-pink-500')
          }`}>
            {currentMascotObj.emoji}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight font-nunito">
                {getSubjectTitle()}
              </span>
              <span className={`text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm ${
                isMath 
                  ? (isGrade7 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-amber-500 to-orange-500')
                  : (isGrade7 ? 'bg-gradient-to-r from-rose-600 to-purple-600' : 'bg-gradient-to-r from-rose-500 to-pink-500')
              }`}>
                GDPT 2018
              </span>
            </div>
            <p className={`text-[12px] font-bold font-quicksand ${
              isMath 
                ? (isGrade7 ? 'text-blue-600' : 'text-amber-600') 
                : (isGrade7 ? 'text-purple-600' : 'text-pink-600')
            }`}>
              {getSubjectSubtitle()}
            </p>
          </div>
        </div>

        {/* Grade & Subject Switchers */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Grade Switcher (Lớp 4 / Lớp 7) */}
          <div className="bg-slate-100 p-1 rounded-2xl border-2 border-slate-200 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => switchGrade('4')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs transition-all ${
                !isGrade7
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 shadow-sm scale-105'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Lớp 4</span>
            </button>

            <button
              onClick={() => switchGrade('7')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs transition-all ${
                isGrade7
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm scale-105'
                  : 'text-slate-600 hover:text-blue-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Lớp 7 🚀</span>
            </button>
          </div>

          {/* Subject Switcher (Toán / Tiếng Việt - Ngữ Văn) */}
          <div className="bg-slate-100 p-1 rounded-2xl border-2 border-slate-200 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => switchSubject('math')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs sm:text-sm transition-all ${
                isMath
                  ? isGrade7
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm scale-105'
                    : 'bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 shadow-sm scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>🧮 Toán Học</span>
            </button>

            <button
              onClick={() => switchSubject('vietnamese')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs sm:text-sm transition-all ${
                !isMath
                  ? isGrade7
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm scale-105'
                    : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>{isGrade7 ? '📖 Ngữ Văn 7' : '📖 Tiếng Việt 4'}</span>
            </button>
          </div>
        </div>

        {/* Stats Pill Badges */}
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-extrabold">
          {/* Stars */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 shadow-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse-subtle" />
            <span>{totalStars} <span className="text-amber-700 text-xs hidden sm:inline">Sao</span></span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-yellow-900 shadow-sm">
            <Coins className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>{coins} <span className="text-yellow-700 text-xs hidden sm:inline">Xu</span></span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border-2 border-orange-300 rounded-xl text-orange-900 shadow-sm">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span>{streakData.currentStreak} <span className="text-orange-700 text-xs hidden sm:inline">Ngày</span></span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border-2 transition-all ${
              soundEnabled 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
            }`}
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Free Mode Unlock Switch */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleFreeMode();
            }}
            className={`px-2.5 py-1.5 rounded-xl border-2 flex items-center gap-1.5 text-xs transition-all ${
              isFreeMode 
                ? 'bg-purple-100 border-purple-400 text-purple-800 font-black' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Bật/Tắt chế độ mở khóa tự do tất cả tuần"
          >
            {isFreeMode ? <Unlock className="w-3.5 h-3.5 text-purple-600" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFreeMode ? 'Đã Mở Tất Cả' : 'Mở Khóa Tự Do'}</span>
          </button>

          {/* Mascot Profile Trigger */}
          <button
            onClick={() => {
              sounds.playPop();
              setTempName(profile.name);
              setTempMascot(profile.mascot);
              setShowProfileModal(true);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-900 rounded-xl transition-all shadow-sm"
          >
            <span className="text-lg">{currentMascotObj.emoji}</span>
            <span className="max-w-[80px] sm:max-w-[110px] truncate text-xs font-bold">{profile.name}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5">
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? isMath
                      ? isGrade7
                        ? 'bg-blue-600 text-white shadow-bouncy-sm btn-bouncy'
                        : 'bg-amber-400 text-amber-950 shadow-bouncy-sm btn-bouncy'
                      : isGrade7
                      ? 'bg-purple-600 text-white shadow-bouncy-sm btn-bouncy'
                      : 'bg-rose-500 text-white shadow-bouncy-sm btn-bouncy'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile & Mascot Customizer Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black text-slate-800">Hồ Sơ Của Bạn</h3>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Name Input */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Tên hiển thị:
              </label>
              <input
                type="text"
                value={tempName}
                maxLength={25}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800"
              />
            </div>

            {/* Mascot Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-600 mb-2">
                Chọn Linh Vật Đồng Hành:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {MASCOTS.map((m) => {
                  const isSelected = tempMascot === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setTempMascot(m.id)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected 
                          ? 'border-amber-400 bg-amber-50/80 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-3xl">{m.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs text-slate-800 truncate">{m.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{m.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl shadow-bouncy-sm btn-bouncy text-xs"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
