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
import { RewardRulesModal } from './RewardRulesModal';
import { WithdrawModal } from './WithdrawModal';

const MASCOTS = [
  { id: 'elephant', name: 'Bé Voi Dũng Cảm', emoji: '🐘', desc: 'Siêu trí nhớ & Kiên trì' },
  { id: 'owl', name: 'Cú Mèo Thông Thái', emoji: '🦉', desc: 'Bậc thầy tính nhẩm & Ngữ pháp' },
  { id: 'squirrel', name: 'Sóc Con Nhanh Nhẹn', emoji: '🐿️', desc: 'Nhanh mắt nhanh tay' },
  { id: 'cat', name: 'Mèo Miu Đáng Yêu', emoji: '🐱', desc: 'Chăm chỉ mỗi ngày' },
];

export const Navbar = ({ currentTab, onSelectTab, isQuizActive = false, onLogout }) => {
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
    piggyBalance,
    streakData, 
    wrongQuestions, 
    soundEnabled, 
    toggleSound, 
    isFreeMode, 
    toggleFreeMode,
    account,
    parentPin
  } = useLearning();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState(profile?.name || 'Học Sinh');
  const [tempAvatar, setTempAvatar] = useState(profile?.avatar || '🐯');
  const [tempPin, setTempPin] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Keep temp states in sync with current profile
  React.useEffect(() => {
    if (profile?.name) setTempName(profile.name);
    if (profile?.avatar) setTempAvatar(profile.avatar);
  }, [profile?.name, profile?.avatar]);

  const currentMascotObj = MASCOTS.find(m => m.id === profile.mascot) || MASCOTS[0];

  const handleSaveProfile = () => {
    try { sounds.playVictory(); } catch {}
    const updatePayload = {
      name: tempName.trim() || 'Học Sinh',
      avatar: tempAvatar,
      mascot: tempAvatar
    };
    if (showChangePin && tempPin && tempPin.length === 4) {
      updatePayload.pin = tempPin;
    }
    updateProfile(updatePayload);
    setShowProfileModal(false);
    setShowChangePin(false);
    setTempPin('');
  };

  const navItems = [
    { id: 'roadmap', label: 'Lộ Trình 6 Chặng', icon: Compass, badge: null },
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
    return isMath ? 'Toán Lớp 3' : 'Tiếng Việt 3';
  };

  const getSubjectSubtitle = () => {
    if (isGrade7) {
      return isMath ? 'Chinh Phục Đại Số & Hình Học 🚀' : 'Khám Phá Văn Học & Tiếng Việt 7 📖';
    }
    return isMath ? 'Phiêu Lưu Ký Toán Học 🚀' : 'Hành Trình Khám Phá Tiếng Việt 📖';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b-2 border-amber-200 shadow-sm transition-all">
        {/* ROW 1: Brand Logo + Profile + Stats + Mini Switchers (Height ~48px) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Left: Brand + Mascot + Student Name Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div 
              onClick={() => { sounds.playClick(); if (!isQuizActive) onSelectTab('roadmap'); }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform ${
                isMath 
                  ? (isGrade7 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-amber-400 to-orange-500') 
                  : (isGrade7 ? 'bg-gradient-to-br from-rose-500 to-purple-600' : 'bg-gradient-to-br from-rose-400 to-pink-500')
              }`}>
                {currentMascotObj.emoji}
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm sm:text-base text-slate-800 tracking-tight font-nunito">
                    {getSubjectTitle()}
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                    GDPT
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Pill Trigger */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  try { sounds.playClick(); } catch {}
                  setTempName(profile?.name || 'Học Sinh');
                  setTempAvatar(profile?.avatar || '🐯');
                  setShowProfileModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-300 hover:border-amber-400 text-amber-950 rounded-full font-black text-xs transition-all shadow-xs cursor-pointer select-none group"
                title="Bấm vào đây để đổi Hình đại diện & Biệt danh của bé"
              >
                <span className="text-base leading-none group-hover:scale-110 transition-transform">{profile?.avatar || '🐯'}</span>
                <span className="max-w-[70px] sm:max-w-[110px] truncate">{profile?.name || 'Học Sinh'}</span>
                <span className="text-[10px] text-amber-700/60 group-hover:text-amber-950 transition-colors">✏️</span>
              </button>

              {onLogout && (
                <button
                  onClick={(e) => { e.stopPropagation(); sounds.playClick(); onLogout(); }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-bold rounded-full transition-colors inline-flex items-center gap-0.5"
                  title="Đổi sang tài khoản học sinh khác"
                >
                  Đổi bé ↩
                </button>
              )}
            </div>
          </div>

          {/* Middle: Performance Badges & Reward Actions */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-black overflow-x-auto scrollbar-none py-0.5">
            {/* Stars */}
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 shrink-0 shadow-2xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{totalStars}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-300 rounded-xl text-yellow-900 shrink-0 shadow-2xs">
              <Coins className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
              <span>{coins}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-300 rounded-xl text-orange-900 shrink-0 shadow-2xs hidden lg:flex">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
              <span>{streakData.currentStreak}d</span>
            </div>

            {/* Piggy Bank Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 shrink-0 shadow-2xs">
              <span className="text-sm">🐷</span>
              <span>{(piggyBalance || 0).toLocaleString('vi-VN')} <span className="text-[10px] text-rose-700">đ</span></span>
            </div>

            {/* Rules Button */}
            <button
              onClick={() => { sounds.playClick(); setShowRulesModal(true); }}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs shrink-0 transition-all shadow-2xs"
              title="Xem quy tắc thưởng Heo Đất Tri Thức"
            >
              <span>📜</span>
              <span className="hidden sm:inline">Quy Tắc</span>
            </button>

            {/* Withdraw Button */}
            <button
              onClick={() => { sounds.playClick(); setShowWithdrawModal(true); }}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs shrink-0 transition-all shadow-2xs"
              title="Xin Ba Mẹ đổi quà từ Heo Đất"
            >
              <span>🎁</span>
              <span className="hidden sm:inline">Đổi Quà</span>
            </button>
          </div>

          {/* Right: Switchers & Utility Toggles */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Grade Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-extrabold">
              <button
                onClick={() => switchGrade('4')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  !isGrade7
                    ? 'bg-amber-400 text-amber-950 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lớp 3
              </button>
              <button
                onClick={() => switchGrade('7')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  isGrade7
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lớp 7
              </button>
            </div>

            {/* Subject Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-extrabold">
              <button
                onClick={() => switchSubject('math')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  isMath
                    ? isGrade7 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-amber-400 text-amber-950 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🧮 Toán
              </button>
              <button
                onClick={() => switchSubject('vietnamese')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  !isMath
                    ? isGrade7 ? 'bg-purple-600 text-white shadow-2xs' : 'bg-rose-500 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📖 Văn
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-xl border transition-all ${
                soundEnabled 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
              }`}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Free Mode Unlock Switch */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowPinModal(true);
              }}
              className={`p-1.5 rounded-xl border transition-all ${
                isFreeMode 
                  ? 'bg-purple-100 border-purple-400 text-purple-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title={isFreeMode ? "Đã mở khóa tự do tất cả tuần" : "Mở khóa tự do (cần mã PIN)"}
            >
              {isFreeMode ? <Unlock className="w-3.5 h-3.5 text-purple-600" /> : <Lock className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ROW 2: Navigation Tab Bar (Chỉ hiển thị khi KHÔNG trong bài thi) */}
        {!isQuizActive && (
          <div className="border-t border-amber-100/80 bg-amber-50/30">
            <div className="max-w-7xl mx-auto px-3 sm:px-5">
              <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
                        isActive
                          ? isMath
                            ? isGrade7
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-amber-400 text-amber-950 shadow-xs'
                            : isGrade7
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-rose-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Parent Portal Direct Link */}
                <a
                  href="/parent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 hover:text-indigo-900 rounded-xl font-black text-xs sm:text-sm shrink-0 transition-all shadow-2xs ml-auto cursor-pointer"
                  title="Mở Cổng Ba Mẹ Quản Trị (Theo dõi tiến trình từ xa trên điện thoại/máy tính)"
                >
                  <span>👨‍👩‍👧</span>
                  <span className="hidden sm:inline">Cổng Ba Mẹ</span>
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Profile & Mascot Customizer Modal (ĐƯỢC RENDER NGOÀI HEADER) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-md w-full p-6 animate-scale-in my-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-800">Hồ Sơ & Biệt Danh Của Bé</h3>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Account Credentials Info Badge */}
            {account ? (
              <div className="mb-4 p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">Tên đăng nhập (khi đổi máy):</span>
                  <span className="text-sm font-black text-amber-950 font-mono">@{account.username}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 block">Mật khẩu 4 số:</span>
                  <span className="text-sm font-black text-amber-950 font-mono tracking-widest">••••</span>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <p className="text-xs font-bold text-amber-900 mb-1">
                  💡 Bé đang học ở chế độ máy này (chưa liên kết đám mây).
                </p>
                <p className="text-[11px] text-slate-600">
                  Để học tiếp lịch sử trên điện thoại hoặc máy tính mới, bé hãy bấm nút <span className="font-bold text-amber-950">"Đổi bé ↩"</span> ở thanh menu và chọn <span className="font-bold text-amber-950">"Tạo Tài Khoản Mới"</span> nhé!
                </p>
              </div>
            )}

            {/* Live Preview of the Badge */}
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-amber-950 block">Biểu tượng hiển thị:</span>
                <span className="text-[10px] font-bold text-amber-700">Xem trước khi lưu</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-amber-400 text-amber-950 rounded-full font-black text-sm shadow-xs">
                <span className="text-lg leading-none">{tempAvatar}</span>
                <span className="max-w-[120px] truncate">{tempName.trim() || 'Học Sinh'}</span>
                <span className="text-[10px] text-amber-600">✏️</span>
              </div>
            </div>

            {/* Nickname Input */}
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-700 mb-1">
                Biệt danh của bé (Nickname hiển thị trong app):
              </label>
              <input
                type="text"
                value={tempName}
                maxLength={30}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Ví dụ: Bé Bi Yêu, Siêu Nhân Chip..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white"
              />
              <span className="text-[10px] font-bold text-amber-700 mt-1 block">
                ⭐ Bé có thể đổi biệt danh này bất cứ lúc nào, không liên quan và không làm thay đổi tên đăng nhập.
              </span>
            </div>

            {/* Mascot / Avatar Selector */}
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Chọn linh vật / hình đại diện mới:
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {['🐯', '🐰', '🐼', '🦊', '🐶', '🐱', '🦁', '🐸', '🐵', '🦉'].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      try { sounds.playClick(); } catch {}
                      setTempAvatar(av);
                    }}
                    className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                      tempAvatar === av
                        ? 'bg-amber-300 scale-110 ring-2 ring-amber-400 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Change 4-digit PIN Section */}
            {account && (
              <div className="mb-5 pt-3 border-t border-slate-100">
                {!showChangePin ? (
                  <button
                    type="button"
                    onClick={() => setShowChangePin(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                  >
                    <span>🔑 Đổi mật khẩu 4 số mới</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700">Mật khẩu 4 số mới:</label>
                      <button
                        type="button"
                        onClick={() => { setShowChangePin(false); setTempPin(''); }}
                        className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
                      >
                        Hủy
                      </button>
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={tempPin}
                      onChange={(e) => setTempPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Nhập 4 số mới (VD: 8888)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-center tracking-widest text-slate-800"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => { setShowProfileModal(false); setShowChangePin(false); setTempPin(''); }}
                className="px-4 py-2 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl shadow-bouncy-sm btn-bouncy text-xs"
              >
                Lưu Thay Đổi 💾
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal for Free Mode */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-sm w-full p-6 animate-scale-in my-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Góc Phụ Huynh</h3>
            <p className="text-sm font-bold text-slate-600 mb-4">
              Vui lòng nhập mã PIN của phụ huynh để {isFreeMode ? 'tắt' : 'bật'} tính năng này.
            </p>
            
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              className="w-full text-center tracking-[1em] font-bold text-2xl py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none mb-2"
              placeholder="••••"
            />
            {pinError && <p className="text-red-500 text-sm font-bold mb-4 text-center">{pinError}</p>}
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError('');
                }}
                className="flex-1 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  if (account?.pin && pinInput === account.pin && pinInput !== (parentPin || '2026')) {
                    setPinError('Đây là mật khẩu của bé! Vui lòng nhập mật khẩu riêng của Ba Mẹ.');
                    return;
                  }
                  if (pinInput === (parentPin || '2026')) {
                    toggleFreeMode();
                    setShowPinModal(false);
                    setPinInput('');
                    setPinError('');
                  } else {
                    setPinError('Mật khẩu Ba Mẹ không đúng!');
                  }
                }}
                className="flex-1 py-2 bg-amber-400 text-amber-950 font-bold rounded-xl shadow-bouncy-sm hover:bg-amber-500"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Rules Modal (ĐƯỢC RENDER NGOÀI HEADER) */}
      {showRulesModal && (
        <RewardRulesModal 
          onClose={() => setShowRulesModal(false)}
          onOpenWithdraw={() => setShowWithdrawModal(true)}
        />
      )}

      {/* Withdraw Modal (ĐƯỢC RENDER NGOÀI HEADER) */}
      {showWithdrawModal && (
        <WithdrawModal 
          onClose={() => setShowWithdrawModal(false)}
          onOpenRules={() => setShowRulesModal(true)}
        />
      )}
    </>
  );
};

