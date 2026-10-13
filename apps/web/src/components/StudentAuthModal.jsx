'use client';
import React, { useState } from 'react';
import { User, KeyRound, Sparkles, LogIn, UserPlus, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import sounds from '../utils/soundEffects';

const AVATARS = ['🐯', '🐰', '🐼', '🦊', '🐶', '🐱', '🦁', '🐸', '🐵', '🦉'];

export const StudentAuthModal = ({ onLoginSuccess, onContinueOffline }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');
  
  // Register form states
  const [regUsername, setRegUsername] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regNickname, setRegNickname] = useState(() => {
    try {
      const activeData = localStorage.getItem('activeProfileData');
      if (activeData) {
        const p = JSON.parse(activeData);
        if (p.name && p.name !== 'Học Sinh') return p.name;
      }
      const rawList = localStorage.getItem('agy_profiles');
      if (rawList) {
        const list = JSON.parse(rawList);
        if (list[0]?.name) return list[0].name;
      }
    } catch {}
    return '';
  });
  const [regAvatar, setRegAvatar] = useState(() => {
    try {
      const activeData = localStorage.getItem('activeProfileData');
      if (activeData) {
        const p = JSON.parse(activeData);
        if (p.avatar) return p.avatar;
      }
    } catch {}
    return '🐯';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockedSessionInfo, setLockedSessionInfo] = useState(null);
  const [showForceTransfer, setShowForceTransfer] = useState(false);
  const [parentPinForTransfer, setParentPinForTransfer] = useState('');

  const getSessionId = () => {
    try {
      let sid = localStorage.getItem('agy_session_id');
      if (!sid) {
        sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('agy_session_id', sid);
      }
      return sid;
    } catch {
      return 'sess_' + Date.now();
    }
  };

  const getDeviceInfo = () => {
    try {
      const ua = navigator.userAgent;
      let os = "Máy tính";
      if (/windows/i.test(ua)) os = "Máy tính Windows";
      else if (/macintosh|mac os x/i.test(ua)) os = "Máy Mac";
      else if (/iphone|ipad|ipod/i.test(ua)) os = "Thiết bị Apple";
      else if (/android/i.test(ua)) os = "Thiết bị Android";

      let browser = "Web";
      if (/edg/i.test(ua)) browser = "Edge";
      else if (/chrome/i.test(ua)) browser = "Chrome";
      else if (/safari/i.test(ua)) browser = "Safari";
      else if (/firefox/i.test(ua)) browser = "Firefox";

      return `${os} (${browser})`;
    } catch {
      return "Trình duyệt Web";
    }
  };

  // Collect any existing local progress on this device to migrate to cloud
  const collectLocalStudentData = () => {
    try {
      const activeId = localStorage.getItem('activeProfileId') || 'default';
      const read = (key) => {
        try {
          const val = localStorage.getItem(key);
          return val ? JSON.parse(val) : null;
        } catch { return null; }
      };

      const getVal = (prefix) => {
        return read(`${prefix}_${activeId}`) ?? read(`${prefix}_default`);
      };

      const g4Math = getVal('agy_prog_g4m');
      const g4Tv = getVal('agy_prog_g4tv');
      const g7Math = getVal('agy_prog_g7m');
      const g7Lit = getVal('agy_prog_g7lit');
      const hist = getVal('agy_history');
      const piggy = getVal('agy_piggy');
      const coins = getVal('agy_coins');

      if (g4Math || g4Tv || hist || piggy !== null || coins !== null) {
        return {
          currentGrade: getVal('agy_grade') || '4',
          currentSubject: getVal('agy_subject') || 'math',
          g4MathProgress: g4Math || { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
          g4TvProgress: g4Tv || { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
          g7MathProgress: g7Math || { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
          g7LitProgress: g7Lit || { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
          history: hist || [],
          wrongG4Math: getVal('agy_wrong_g4m') || [],
          wrongG4Tv: getVal('agy_wrong_g4tv') || [],
          wrongG7Math: getVal('agy_wrong_g7m') || [],
          wrongG7Lit: getVal('agy_wrong_g7lit') || [],
          badges: getVal('agy_badges') || [],
          streakData: getVal('agy_streak') || { currentStreak: 1, lastDate: new Date().toISOString().split('T')[0] },
          coins: typeof coins === 'number' ? coins : 50,
          piggyBalance: typeof piggy === 'number' ? piggy : 0,
          piggyHistory: getVal('agy_piggy_hist') || [],
          piggyRequests: getVal('agy_piggy_req') || [],
          claimedStages: getVal('agy_piggy_stages') || [],
          claimedFinal: getVal('agy_piggy_final') || false,
          reportedQuestions: getVal('agy_reported_q') || [],
          verifiedErrorIds: getVal('agy_verified_err') || []
        };
      }
    } catch (e) {
      console.warn('Could not collect local data:', e);
    }
    return null;
  };

  // Execute Login with optional forceTransfer
  const executeLogin = async (force = false) => {
    setErrorMsg('');

    const cleanUsername = loginUsername.trim().toLowerCase();
    const cleanPin = loginPin.trim();

    if (!cleanUsername) {
      setErrorMsg('Bé ơi, hãy nhập tên đăng nhập nhé!');
      sounds.playWrong();
      return;
    }

    if (!cleanPin || cleanPin.length !== 4) {
      setErrorMsg('Mật khẩu phải gồm đúng 4 chữ số!');
      sounds.playWrong();
      return;
    }

    setIsLoading(true);
    sounds.playClick();

    try {
      const payload = {
        username: cleanUsername,
        pin: cleanPin,
        sessionId: getSessionId(),
        deviceInfo: getDeviceInfo(),
        forceTransfer: force,
        parentPin: force ? parentPinForTransfer.trim() : undefined
      };

      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.isSessionLocked) {
        setLockedSessionInfo({
          activeDevice: data.activeDevice,
          lastActiveSecondsAgo: data.lastActiveSecondsAgo,
          error: data.error
        });
        sounds.playWrong();
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng nhập không thành công');
      }

      // Success!
      setLockedSessionInfo(null);
      setShowForceTransfer(false);
      setParentPinForTransfer('');
      sounds.playVictory();
      onLoginSuccess(data.account);
    } catch (err) {
      sounds.playWrong();
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login form submit
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    executeLogin(false);
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = regUsername.trim().toLowerCase();
    const cleanPin = regPin.trim();
    const cleanNickname = regNickname.trim() || cleanUsername;

    if (!cleanUsername || cleanUsername.length < 2) {
      setErrorMsg('Tên đăng nhập phải có ít nhất 2 ký tự (chữ hoặc số)!');
      sounds.playWrong();
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(cleanUsername)) {
      setErrorMsg('Tên đăng nhập viết liền không dấu, chỉ gồm chữ và số (VD: bebi, chip2016)!');
      sounds.playWrong();
      return;
    }

    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setErrorMsg('Mật khẩu phải gồm đúng 4 chữ số (VD: 1234)!');
      sounds.playWrong();
      return;
    }

    setIsLoading(true);
    sounds.playClick();

    try {
      const localData = collectLocalStudentData();
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          pin: cleanPin,
          nickname: cleanNickname,
          avatar: regAvatar,
          initialData: localData
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng ký không thành công');
      }

      sounds.playVictory();
      onLoginSuccess(data.account);
    } catch (err) {
      sounds.playWrong();
      setErrorMsg(err.message || 'Lỗi khi tạo tài khoản. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-100/90 via-orange-50/95 to-amber-200/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in relative">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-md animate-bounce-gentle">
            🐯
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight font-nunito">
            Toán 3 Kết Nối Tri Thức
          </h1>
          <p className="text-xs sm:text-sm font-bold text-amber-700 mt-1 flex items-center justify-center gap-1.5">
            <span>Đồng bộ tiến trình học tập đa thiết bị</span>
            <span>☁️</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-amber-50 rounded-2xl border-2 border-amber-200 mb-5">
          <button
            type="button"
            onClick={() => { sounds.playClick(); setMode('login'); setErrorMsg(''); }}
            className={`py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>
          <button
            type="button"
            onClick={() => { sounds.playClick(); setMode('register'); setErrorMsg(''); }}
            className={`py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>

        {/* Session Lock Warning Banner */}
        {lockedSessionInfo && (
          <div className="p-4 mb-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-800 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <span className="text-2xl shrink-0">⚠️</span>
              <div className="flex-1">
                <h4 className="font-black text-sm text-amber-900 mb-1">
                  Tài Khoản Đang Học Trên Thiết Bị Khác!
                </h4>
                <p className="text-xs font-semibold text-slate-600 mb-2 leading-relaxed">
                  {lockedSessionInfo.error}
                </p>
                <div className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1.5 rounded-xl mb-3 flex items-center justify-between">
                  <span>📱 Đang mở trên: <span className="font-extrabold">{lockedSessionInfo.activeDevice}</span></span>
                  <span className="text-[10px] text-amber-700">Cách đây {lockedSessionInfo.lastActiveSecondsAgo}s</span>
                </div>

                {!showForceTransfer ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => executeLogin(false)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Thử Lại 🔄
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForceTransfer(true)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                    >
                      Chuyển Sang Máy Này 🔑
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-amber-200">
                    <label className="block text-[11px] font-black text-slate-700">
                      Nhập mã PIN Ba Mẹ (Mặc định: 2026 hoặc mã con) để mở khóa chuyển máy:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={parentPinForTransfer}
                        onChange={(e) => setParentPinForTransfer(e.target.value.replace(/\D/g, ''))}
                        placeholder="2026"
                        className="w-24 px-3 py-1.5 rounded-xl border-2 border-amber-300 font-black text-center text-sm focus:outline-none focus:border-amber-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => executeLogin(true)}
                        disabled={isLoading}
                        className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                      >
                        Xác Nhận Chuyển 🚀
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForceTransfer(false)}
                        className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-bold"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Tên đăng nhập của bé:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value.toLowerCase())}
                  placeholder="Ví dụ: bebi hoặc chip2016"
                  autoComplete="username"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-sm text-slate-800 bg-slate-50 focus:bg-white transition-colors"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-700">
                  Mật khẩu 4 số (Mã PIN):
                </label>
                <span className="text-[11px] font-bold text-slate-400">4 chữ số</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={loginPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setLoginPin(val);
                  }}
                  placeholder="• • • •"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-black text-lg tracking-widest text-slate-800 bg-slate-50 focus:bg-white transition-colors text-center"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 font-black rounded-xl shadow-bouncy-sm btn-bouncy flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Vào Học Tiếp 🚀</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* MODE 2: REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Username */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Tên đăng nhập <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="Viết liền không dấu (VD: bebi, chip2016)"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 focus:bg-white transition-colors"
                required
              />
              <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">
                Dùng để đăng nhập khi học trên điện thoại hoặc máy tính mới
              </span>
            </div>

            {/* PIN (4 digits) */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Mật khẩu 4 số (Mã PIN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={regPin}
                onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4 số dễ nhớ (VD: 1234)"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-black text-base tracking-widest text-slate-800 bg-slate-50 focus:bg-white transition-colors text-center"
                required
              />
            </div>

            {/* Nickname (Independent from username) */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Biệt danh của bé (Nickname hiển thị trong app):
              </label>
              <input
                type="text"
                value={regNickname}
                onChange={(e) => setRegNickname(e.target.value)}
                placeholder="Tên thân mật (VD: Bé Bi Yêu, Siêu Nhân Chip)"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-xs sm:text-sm text-slate-800 bg-slate-50 focus:bg-white transition-colors"
              />
              <span className="text-[10px] font-bold text-amber-700 mt-0.5 block">
                ⭐ Bé có thể đổi biệt danh này bất cứ lúc nào trong app, không ảnh hưởng đến tên đăng nhập
              </span>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Chọn linh vật đại diện:
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => { sounds.playPop(); setRegAvatar(av); }}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-transform ${
                      regAvatar === av
                        ? 'bg-amber-400 border-2 border-amber-600 scale-110 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black rounded-xl shadow-bouncy-sm btn-bouncy flex items-center justify-center gap-2 mt-3 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Tài Khoản & Bắt Đầu Học 🌟</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Cloud Sync Assurance Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tiến trình làm bài & Heo đất được lưu an toàn trên đám mây</span>
          </div>

          {onContinueOffline && (
            <button
              type="button"
              onClick={onContinueOffline}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 underline mt-1"
            >
              Hoặc tiếp tục với tài khoản máy này (Không đồng bộ)
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
