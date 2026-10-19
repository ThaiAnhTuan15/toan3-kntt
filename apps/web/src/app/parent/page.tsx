'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, KeyRound, Sparkles, Check, AlertCircle, RefreshCw, 
  LogOut, Award, Star, Coins, Flame, BookOpen, Clock, 
  ChevronRight, CheckCircle2, XCircle, Gift, Heart, 
  ShieldCheck, Eye, ArrowLeft, Send, Search, Compass, 
  HelpCircle, Lock, ExternalLink
} from 'lucide-react';

const STAGES_LIST = [
  { id: 1, title: "Chặng 1: Vương quốc Số học & Phép tính cơ bản", weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13], color: "from-amber-400 to-orange-500", badge: "Vệ binh Số học" },
  { id: 2, title: "Chặng 2: Khu rừng Bảng Cửu chương & Một phần mấy", weeks: [14,15,16,17,18,19,20,21,22,23], color: "from-emerald-400 to-teal-600", badge: "Bậc thầy Cửu chương" },
  { id: 3, title: "Chặng 3: Xứ sở Hình học & Không gian kỳ thú", weeks: [24,25,26,27,28,29,30,31,32,33,34,35,36], color: "from-blue-400 to-indigo-600", badge: "Kiến trúc sư nhí" },
  { id: 4, title: "Chặng 4: Đấu trường Phép tính & Toán 2 bước tính", weeks: [37,38,39,40,41,42,43,44,45,46,47,48], color: "from-rose-400 to-red-600", badge: "Hiệp sĩ 2 Bước" },
  { id: 5, title: "Chặng 5: Thung lũng Đo lường & Nhà thám hiểm", weeks: [49,50,51,52,53,54,55,56,57], color: "from-cyan-400 to-blue-600", badge: "Nhà Đo lường Đại tài" },
  { id: 6, title: "Chặng 6: Đỉnh núi Ôn tập & Kỳ thi Cuối Học Kỳ 1", weeks: [58,59,60,61,62,63,64,65,66], color: "from-purple-500 to-pink-600", badge: "Trạng Nguyên Toán 3" },
];

export default function ParentAdminPage() {
  // Auth state - KHÔNG tự động đăng nhập, luôn bắt buộc nhập mật khẩu cha mẹ mỗi lần truy cập
  const [authData, setAuthData] = useState(null);

  const [inputUsername, setInputUsername] = useState(() => {
    try {
      const lastAcc = localStorage.getItem('agy_active_account');
      if (lastAcc) return JSON.parse(lastAcc).username || '';
    } catch {}
    return 'phuongchi';
  });

  const [inputPin, setInputPin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Student loaded state
  const [student, setStudent] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'stages' | 'piggy' | 'reports' | 'settings'

  // Modal inspection states
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState('20000');
  const [bonusNote, setBonusNote] = useState('Ba mẹ khen ngợi con chăm chỉ học bài!');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Change PIN modal
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newChildPin, setNewChildPin] = useState('');
  const [showChangeParentPinModal, setShowChangeParentPinModal] = useState(false);
  const [newParentPinInput, setNewParentPinInput] = useState('');

  // Fetch student data from server
  const fetchStudentData = async (username, pin) => {
    setIsLoadingData(true);
    setAuthError('');
    try {
      const res = await fetch('/api/parent/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          parentPin: pin.trim()
        })
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || 'Không thể tải dữ liệu học sinh');
      }

      setStudent(resJson.student);
      setLastRefreshedAt(new Date().toLocaleTimeString('vi-VN'));
      return resJson.student;
    } catch (err) {
      setAuthError(err.message || 'Lỗi kết nối máy chủ');
      return null;
    } finally {
      setIsLoadingData(false);
    }
  };

  // Clear any previously stored parent session to prevent auto-login
  useEffect(() => {
    try {
      localStorage.removeItem('agy_parent_auth');
    } catch {}
  }, []);

  // Auto-refresh interval (every 30 seconds while parent is in current session)
  useEffect(() => {
    if (!autoRefresh || !authData?.username || !authData?.pin) return;
    const interval = setInterval(() => {
      fetchStudentData(authData.username, authData.pin);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, authData]);

  // Handle Parent Login (Chỉ lưu vào bộ nhớ tạm session, đóng tab/truy cập lại phải nhập lại)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputUsername.trim()) {
      setAuthError('Vui lòng nhập tên đăng nhập của bé!');
      return;
    }
    if (!inputPin.trim()) {
      setAuthError('Vui lòng nhập mã PIN phụ huynh!');
      return;
    }

    setIsLoggingIn(true);
    const loadedStudent = await fetchStudentData(inputUsername, inputPin);
    setIsLoggingIn(false);

    if (loadedStudent) {
      const creds = { username: inputUsername.trim().toLowerCase(), pin: inputPin.trim() };
      setAuthData(creds);
      // Không lưu vào localStorage để tránh tự động đăng nhập khi mở lại
      try {
        localStorage.removeItem('agy_parent_auth');
      } catch {}
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthData(null);
    setStudent(null);
    setInputPin('');
    try {
      localStorage.removeItem('agy_parent_auth');
    } catch {}
  };

  // Handle Action (Approve, Reject, Bonus, Verify, Change PIN)
  const handleParentAction = async (action, payload) => {
    if (!authData) return;
    setIsSubmittingAction(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch('/api/parent/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authData.username,
          parentPin: authData.pin,
          action,
          payload
        })
      });
      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || 'Thao tác không thành công');
      }

      setActionSuccessMsg(resJson.message);
      const activePin = (action === 'change_parent_pin' && payload?.newParentPin) ? payload.newParentPin : authData.pin;
      if (action === 'change_parent_pin' && payload?.newParentPin) {
        setAuthData(prev => prev ? { ...prev, pin: payload.newParentPin } : prev);
      }
      // Refresh student data
      await fetchStudentData(authData.username, activePin);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Lỗi khi thực hiện thao tác');
    } finally {
      setIsSubmittingAction(false);
      setShowBonusModal(false);
      setShowChangePinModal(false);
      setShowChangeParentPinModal(false);
    }
  };

  // Derived student data
  const studentData = student?.data || {};
  const historyList = Array.isArray(studentData.history) ? studentData.history : [];
  const g4Prog = studentData.g4MathProgress || {};
  const piggyBalance = typeof studentData.piggyBalance === 'number' ? studentData.piggyBalance : 0;
  const piggyRequests = Array.isArray(studentData.piggyRequests) ? studentData.piggyRequests : [];
  const piggyHistory = Array.isArray(studentData.piggyHistory) ? studentData.piggyHistory : [];
  const reportedQuestions = Array.isArray(studentData.reportedQuestions) ? studentData.reportedQuestions : [];
  const verifiedErrorIds = Array.isArray(studentData.verifiedErrorIds) ? studentData.verifiedErrorIds : [];
  const coins = typeof studentData.coins === 'number' ? studentData.coins : 50;
  const streak = studentData.streakData?.currentStreak || 1;

  // Total completed weeks (scored >= 70%)
  const completedWeeks = Object.keys(g4Prog).filter(w => (g4Prog[w]?.bestScore || 0) >= 70).length;
  const totalStars = Object.values(g4Prog).reduce((sum, item) => sum + (item.stars || 0), 0);

  // -------------------------------------------------------------
  // VIEW 1: PARENT LOGIN SCREEN
  // -------------------------------------------------------------
  if (!authData || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
              👨‍👩‍👧
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight font-nunito">
              Cổng Ba Mẹ Quản Trị
            </h1>
            <p className="text-xs sm:text-sm font-bold text-indigo-700 mt-1">
              Theo dõi tiến trình khi con học ở thiết bị khác ☁️
            </p>
          </div>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                Tên đăng nhập tài khoản của bé:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="Ví dụ: phuongchi, bebi..."
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-sm text-slate-800 bg-slate-50 focus:bg-white"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                Tên đăng nhập bé dùng trên máy tính/điện thoại khi học
              </span>
            </div>

            <div>
              <div className="mb-1.5">
                <label className="text-xs font-black text-slate-700">
                  Mật khẩu Cha Mẹ (Mã PIN):
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nhập 4 số PIN của Ba Mẹ"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-black text-base tracking-widest text-slate-800 bg-slate-50 focus:bg-white text-center"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <span className="text-[11px] font-bold text-rose-500 mt-1.5 block">
                🔒 Lưu ý: Không dùng mật khẩu của bé để tránh bé tự vào Cổng Quản Trị.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || isLoadingData}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-60"
            >
              {isLoggingIn || isLoadingData ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang kết nối đám mây...</span>
                </>
              ) : (
                <>
                  <span>Vào Quản Trị & Theo Dõi Bé 🚀</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center flex items-center justify-between text-xs font-bold text-slate-500">
            <Link href="/student" className="text-indigo-600 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Giao diện học sinh</span>
            </Link>
            <span className="text-[11px] text-slate-400">Đồng bộ Cloud Neon DB</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE PARENT ADMIN DASHBOARD (LIVE MONITOR)
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      
      {/* TOP HEADER: STUDENT LIVE STATUS & QUICK CONTROLS */}
      <header className="bg-white rounded-3xl border-2 border-indigo-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Student Identity */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-sm">
            {student.avatar || '🐯'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                {student.nickname || student.username}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-mono font-bold">
                @{student.username}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Trực Tuyến (Cloud Sync)</span>
              </span>
              <span>•</span>
              <span>Mật khẩu con: <strong className="font-mono text-slate-700">{student.pin}</strong></span>
              {lastRefreshedAt && <span>• Cập nhật: {lastRefreshedAt}</span>}
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Refresh button */}
          <button
            onClick={() => fetchStudentData(authData.username, authData.pin)}
            disabled={isLoadingData}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="Tải lại ngay dữ liệu mới nhất từ máy con đang học"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
            <span>Làm Mới</span>
          </button>

          {/* Toggle Auto-refresh */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-xs ${
              autoRefresh 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            title="Tự động cập nhật mỗi 30 giây khi con nộp bài ở máy khác"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{autoRefresh ? 'Tự cập nhật 30s: Bật' : 'Tự cập nhật: Tắt'}</span>
          </button>

          {/* Bonus gift button */}
          <button
            onClick={() => setShowBonusModal(true)}
            className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Thưởng Nóng 🎁</span>
          </button>

          {/* Student view link */}
          <Link
            href="/student"
            target="_blank"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
            title="Mở giao diện làm bài của học sinh trong tab mới"
          >
            <span>Màn học</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Đăng xuất khỏi cổng phụ huynh"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ACTION NOTIFICATION BANNER */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-bold text-sm flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* METRICS CARDS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Completed Quizzes */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-black uppercase tracking-wider">Số Đề Hoàn Thành</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-800">{completedWeeks}</span>
            <span className="text-xs font-bold text-slate-400">/ 66 đề (HK1)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((completedWeeks / 66) * 100))}%` }}
            />
          </div>
        </div>

        {/* Total Stars */}
        <div className="bg-white rounded-2xl border-2 border-yellow-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-yellow-600 mb-1">
            <span className="text-xs font-black uppercase tracking-wider">Tổng Ngôi Sao</span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-800">{totalStars}</span>
            <span className="text-xs font-bold text-slate-400">sao tích lũy</span>
          </div>
          <p className="text-[11px] font-bold text-amber-600 mt-2">
            Đạt 3 sao khi điểm từ 90% trở lên
          </p>
        </div>

        {/* Piggy Bank Balance */}
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-black uppercase tracking-wider">Heo Đất Tri Thức</span>
            <span className="text-base">🐷</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-700">
              {piggyBalance.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs font-bold text-rose-500">VNĐ</span>
          </div>
          <p className="text-[11px] font-bold text-rose-600 mt-2 flex items-center justify-between">
            <span>Tiền thưởng con kiếm được</span>
            {piggyRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                {piggyRequests.filter(r => r.status === 'pending').length} yêu cầu
              </span>
            )}
          </p>
        </div>

        {/* Coins & Streak */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-black uppercase tracking-wider">Xu & Chuyên Cần</span>
            <Coins className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-800">{coins}</span>
            <span className="text-xs font-bold text-slate-400">xu</span>
            <span className="text-xs font-black text-orange-600 flex items-center gap-0.5 ml-auto">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streak} ngày</span>
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-2">
            Học liên tục mỗi ngày tăng thưởng
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none pb-1 text-xs font-black">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lịch Sử Bài Học ({historyList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'stages'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Bản Đồ 6 Chặng</span>
        </button>

        <button
          onClick={() => setActiveTab('piggy')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 relative ${
            activeTab === 'piggy'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🐷</span>
          <span>Heo Đất & Duyệt Thưởng</span>
          {piggyRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white inline-block absolute top-1.5 right-1.5" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 relative ${
            activeTab === 'reports'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🎖️</span>
          <span>Câu Báo Lỗi ({reportedQuestions.length})</span>
          {reportedQuestions.filter(q => q.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white inline-block absolute top-1.5 right-1.5" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Mật Khẩu & Cài Đặt</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: HISTORY LIST (DETAILED VIEW)                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-800">
              Nhật ký làm bài của con ({historyList.length} lượt bài)
            </h2>
            <span className="text-xs text-slate-500 font-bold">
              Bấm vào bài bất kỳ để xem chi tiết câu đúng / sai
            </span>
          </div>

          {historyList.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-base font-bold text-slate-700 mb-1">Chưa có bài học nào được ghi nhận trên máy này</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Nếu bé đã làm bài trên máy tính khác, Ba Mẹ hãy bấm nút <strong>"Làm Mới"</strong> ở góc trên bên phải để tải dữ liệu về nhé!
              </p>
              <button
                onClick={() => fetchStudentData(authData.username, authData.pin)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                🔄 Kiểm tra và tải dữ liệu đám mây ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {historyList.map((item, idx) => {
                const dateStr = item.date ? new Date(item.date).toLocaleString('vi-VN') : 'Không rõ ngày';
                const scoreColor = item.score >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                                   item.score >= 70 ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                   'text-rose-600 bg-rose-50 border-rose-200';

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setViewingQuiz(item)}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-400 p-4 transition-all shadow-xs cursor-pointer hover:shadow-md group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                          {item.title || `Đề Số ${item.week || ''}`}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{dateStr}</span>
                      </div>

                      <div className="flex items-center justify-between my-2">
                        <div>
                          <div className="text-xs font-bold text-slate-500">Đúng {item.correctCount}/{item.totalCount} câu</div>
                          <div className="text-[11px] text-slate-400">Thời gian: {Math.round((item.timeSpent || 0) / 60)} phút</div>
                        </div>
                        <div className={`text-xl font-black px-3 py-1 rounded-xl border ${scoreColor}`}>
                          {item.score}%
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 mt-2">
                      <div className="flex items-center gap-2">
                        {item.earnedStars > 0 && <span className="text-amber-600 flex items-center gap-0.5">⭐ +{item.earnedStars}</span>}
                        {item.earnedMoney > 0 && <span className="text-rose-600">🐷 +{item.earnedMoney.toLocaleString('vi-VN')} đ</span>}
                      </div>
                      <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[11px]">
                        Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: STAGES PROGRESS MAP                                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-800">
            Tiến trình vượt 6 Chặng Học Kỳ 1 (66 Đề Toán 3)
          </h2>

          <div className="space-y-4">
            {STAGES_LIST.map((stage) => {
              const stageWeeks = stage.weeks;
              const completedInStage = stageWeeks.filter(w => (g4Prog[w]?.bestScore || 0) >= 70).length;
              const isStageFinished = completedInStage === stageWeeks.length;
              const percent = Math.round((completedInStage / stageWeeks.length) * 100);

              return (
                <div key={stage.id} className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black text-white bg-gradient-to-r ${stage.color}`}>
                          Chặng {stage.id}
                        </span>
                        <h3 className="font-black text-slate-800 text-sm sm:text-base">{stage.title}</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-0.5 block">
                        Đã làm: {completedInStage}/{stageWeeks.length} đề ({percent}%)
                      </span>
                    </div>

                    {isStageFinished ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã Hoàn Thành Chặng 🎉</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
                        Đang rèn luyện 🚀
                      </span>
                    )}
                  </div>

                  {/* Grid of weeks in this stage */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-13 gap-1.5 pt-2 border-t border-slate-100">
                    {stageWeeks.map(w => {
                      const wData = g4Prog[w];
                      const isDone = (wData?.bestScore || 0) >= 70;
                      const starsCount = wData?.stars || 0;

                      return (
                        <div
                          key={w}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            isDone 
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-black shadow-2xs' 
                              : (wData?.unlocked ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-100/60 border-slate-200 text-slate-300')
                          }`}
                          title={`Đề ${w}: ${isDone ? `Điểm cao nhất ${wData.bestScore}%, ${starsCount} sao` : (wData?.unlocked ? 'Đã mở khóa, chưa hoàn thành' : 'Chưa mở khóa')}`}
                        >
                          <div className="text-[10px] font-bold">Đề {w}</div>
                          <div className="text-xs font-black mt-0.5">
                            {isDone ? `${wData.bestScore}%` : (wData?.unlocked ? '—' : '🔒')}
                          </div>
                          {isDone && (
                            <div className="text-[9px] text-amber-600 font-bold mt-0.5">
                              {'★'.repeat(starsCount)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PIGGY BANK & REWARDS                                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'piggy' && (
        <div className="space-y-6">
          {/* Header Summary Card */}
          <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
                Quỹ Heo Đất Tri Thức Của Bé
              </span>
              <div className="text-3xl sm:text-4xl font-black">
                {piggyBalance.toLocaleString('vi-VN')} <span className="text-lg font-bold">VNĐ</span>
              </div>
              <p className="text-xs font-bold text-rose-100 mt-1">
                Tích lũy từ công sức giải đề đúng và vượt các chặng học tập
              </p>
            </div>

            <button
              onClick={() => setShowBonusModal(true)}
              className="px-5 py-3 bg-white text-rose-700 font-black rounded-2xl shadow-md hover:bg-rose-50 transition-transform active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0"
            >
              <Gift className="w-4 h-4" />
              <span>Thưởng Nóng Thêm Tiền 🎁</span>
            </button>
          </div>

          {/* Pending Withdrawal Requests */}
          <div>
            <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
              <span>🎁</span>
              <span>Yêu cầu đổi quà / lĩnh thưởng của con</span>
            </h3>

            {piggyRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs font-bold text-slate-400">
                Con chưa gửi yêu cầu đổi quà nào
              </div>
            ) : (
              <div className="space-y-3">
                {piggyRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                      req.status === 'pending' ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-rose-700">
                          {Number(req.amount).toLocaleString('vi-VN')} đ
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'rejected' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {req.status === 'approved' ? 'Đã trao quà' :
                           req.status === 'rejected' ? 'Đã từ chối' : 'Chờ Ba Mẹ duyệt'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-600 mt-1">
                        Lời nhắn của con: <em>"{req.note || 'Xin Ba Mẹ đổi quà'}"</em>
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">
                        Gửi lúc: {new Date(req.date).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          disabled={isSubmittingAction}
                          onClick={() => handleParentAction('approve_withdrawal', { requestId: req.id, actualAmount: req.amount })}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                        >
                          Duyệt & Trao Quà ✅
                        </button>
                        <button
                          disabled={isSubmittingAction}
                          onClick={() => handleParentAction('reject_withdrawal', { requestId: req.id })}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History of piggy transactions */}
          <div>
            <h3 className="text-base font-black text-slate-800 mb-3">
              Lịch sử biến động quỹ Heo đất ({piggyHistory.length} giao dịch)
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {piggyHistory.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-black text-slate-800">{item.title}</div>
                    <div className="text-[11px] font-bold text-slate-400">
                      {new Date(item.date).toLocaleString('vi-VN')} {item.note && `• ${item.note}`}
                    </div>
                  </div>
                  <div className={`font-black text-sm ${item.type === 'withdraw' ? 'text-slate-500' : 'text-rose-600'}`}>
                    {item.type === 'withdraw' ? '-' : '+'}{Number(item.amount).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: REPORTED QUESTIONS VERIFICATION                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-800">
              Danh sách câu hỏi con báo lỗi ({reportedQuestions.length} câu)
            </h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Công phát hiện: +5.000đ / câu đúng lỗi
            </span>
          </div>

          {reportedQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs font-bold text-slate-400">
              Bé chưa gửi báo lỗi câu hỏi nào
            </div>
          ) : (
            <div className="space-y-3">
              {reportedQuestions.map((rep) => {
                const isVerified = rep.status === 'verified';

                return (
                  <div
                    key={rep.id}
                    className={`bg-white rounded-2xl border-2 p-4 shadow-xs ${
                      isVerified ? 'border-emerald-200 bg-emerald-50/20' : 'border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {rep.week ? `Đề ${rep.week}` : 'Luyện tập'} • Câu ID: {rep.questionId}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isVerified ? 'Đã xác nhận (+5.000đ)' : 'Chờ Ba Mẹ kiểm tra'}
                      </span>
                    </div>

                    <div className="my-2 p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-800">
                      <strong>Câu hỏi:</strong> {rep.question?.question || 'Nội dung câu hỏi'}
                    </div>

                    <div className="text-xs font-bold text-slate-600 mb-2">
                      <strong>Lý do bé báo:</strong> {rep.reason}
                    </div>

                    {rep.note && (
                      <div className="mb-3 p-2.5 bg-amber-50/90 rounded-xl border border-amber-200">
                        <span className="font-bold text-amber-900 block text-[11px]">
                          ✍️ Lời giải trình chi tiết của bé:
                        </span>
                        <p className="text-slate-800 font-extrabold text-xs mt-0.5 italic whitespace-pre-wrap">
                          "{rep.note}"
                        </p>
                      </div>
                    )}

                    {!isVerified && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          disabled={isSubmittingAction}
                          onClick={() => handleParentAction('verify_error', { reportId: rep.id, rewardAmount: 5000 })}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Xác nhận lỗi & Thưởng bé +5.000đ 🎖️</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: ACCOUNT & SETTINGS                                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 max-w-xl mx-auto">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <span>Quản Lý Tài Khoản Học Sinh</span>
          </h2>

          <div className="space-y-3 text-xs font-bold text-slate-700">
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-500">Tên đăng nhập (Username):</span>
              <span className="font-mono text-indigo-700">@{student.username}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-500">Biệt danh hiển thị:</span>
              <span>{student.nickname}</span>
            </div>
            <div className="flex justify-between py-2 border-b items-center">
              <span className="text-slate-500">Mật khẩu con (Mã PIN 4 số):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-slate-800">{student.pin}</span>
                <button
                  onClick={() => setShowChangePinModal(true)}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-bold hover:bg-indigo-100"
                >
                  Đổi PIN mới
                </button>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b items-center">
              <span className="text-slate-500">Mã PIN Quản trị Phụ huynh:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-slate-800">
                  {studentData.parentPin || '••••'}
                </span>
                <button
                  onClick={() => {
                    setNewParentPinInput('');
                    setShowChangeParentPinModal(true);
                  }}
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-bold hover:bg-purple-100"
                >
                  Đổi PIN Ba Mẹ
                </button>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-500">Ngày tạo tài khoản:</span>
              <span>{new Date(student.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Đồng bộ đám mây lần cuối:</span>
              <span>{new Date(student.updatedAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: VIEW QUIZ DETAILS (CÂU ĐÚNG / SAI)                   */}
      {/* ------------------------------------------------------------- */}
      {viewingQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-indigo-200 shadow-2xl max-w-2xl w-full p-5 sm:p-6 animate-scale-in my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  {viewingQuiz.title || `Chi Tiết Đề ${viewingQuiz.week}`}
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  Nộp bài lúc: {new Date(viewingQuiz.date).toLocaleString('vi-VN')}
                </span>
              </div>
              <button
                onClick={() => setViewingQuiz(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Score pill */}
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-2xl mb-3 text-xs font-bold">
              <div>
                <span className="text-slate-600">Đúng: </span>
                <strong className="text-emerald-700">{viewingQuiz.correctCount}/{viewingQuiz.totalCount} câu</strong>
              </div>
              <div>
                <span className="text-slate-600">Điểm số: </span>
                <strong className="text-indigo-700 text-sm">{viewingQuiz.score}%</strong>
              </div>
              {viewingQuiz.earnedMoney > 0 && (
                <div className="text-rose-600">
                  Thưởng: +{viewingQuiz.earnedMoney.toLocaleString('vi-VN')} đ
                </div>
              )}
            </div>

            {/* Questions detail breakdown */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {Array.isArray(viewingQuiz.details) && viewingQuiz.details.map((item, qIdx) => (
                <div 
                  key={qIdx}
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    item.isCorrect 
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black">Câu {qIdx + 1}</span>
                    <span className={`text-[11px] font-black px-2 py-0.2 rounded-full ${
                      item.isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                    }`}>
                      {item.isCorrect ? '✓ Làm đúng' : '✗ Làm sai'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Mã câu hỏi: {item.questionId} {item.category && `• Dạng: ${item.category}`}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t mt-3 text-right">
              <button
                onClick={() => setViewingQuiz(null)}
                className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: BONUS PIGGY REWARD                                   */}
      {/* ------------------------------------------------------------- */}
      {showBonusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-rose-300 shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-lg font-black text-rose-700 mb-2 flex items-center gap-1.5">
              <span>🎁</span>
              <span>Thưởng Nóng Cho Con</span>
            </h3>
            <p className="text-xs font-bold text-slate-600 mb-4">
              Cộng thêm tiền thưởng vào Heo Đất Tri Thức để khích lệ con chăm ngoan.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Số tiền thưởng (VNĐ):</label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {['10000', '20000', '50000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBonusAmount(amt)}
                      className={`py-1.5 rounded-lg text-xs font-black border transition-all ${
                        bonusAmount === amt 
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {Number(amt).toLocaleString('vi-VN')} đ
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-center font-black text-base text-rose-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Lời nhắn khích lệ:</label>
                <input
                  type="text"
                  value={bonusNote}
                  onChange={(e) => setBonusNote(e.target.value)}
                  placeholder="Lời nhắn từ Ba Mẹ"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowBonusModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={() => handleParentAction('bonus_piggy', { amount: bonusAmount, note: bonusNote })}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-xs"
              >
                Tặng Ngay 🎁
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: CHANGE CHILD PIN                                     */}
      {/* ------------------------------------------------------------- */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-indigo-300 shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-lg font-black text-slate-800 mb-2">Đổi Mật Khẩu 4 Số Cho Con</h3>
            <p className="text-xs font-bold text-slate-600 mb-4">
              Nhập mã 4 số mới để con đăng nhập học trên máy tính hoặc điện thoại.
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newChildPin}
              onChange={(e) => setNewChildPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-center font-black text-xl tracking-widest text-slate-800 mb-4"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowChangePinModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmittingAction || newChildPin.length !== 4}
                onClick={() => handleParentAction('change_pin', { newPin: newChildPin })}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs disabled:opacity-50"
              >
                Lưu Mã PIN Mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: CHANGE PARENT PIN                                    */}
      {/* ------------------------------------------------------------- */}
      {showChangeParentPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-lg font-black text-slate-800 mb-2">Đổi Mật Khẩu Cha Mẹ</h3>
            <p className="text-xs font-bold text-slate-600 mb-4">
              Nhập mã 4 số mới của Ba Mẹ để quản trị và bảo vệ ứng dụng.
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newParentPinInput}
              onChange={(e) => setNewParentPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-3 py-3 rounded-xl border-2 border-slate-200 text-center font-black text-xl tracking-widest text-slate-800 mb-4"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowChangeParentPinModal(false);
                  setNewParentPinInput('');
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmittingAction || newParentPinInput.length !== 4}
                onClick={() => {
                  if (student?.pin && newParentPinInput === student.pin) {
                    alert('Mã PIN Ba Mẹ không được trùng với mật khẩu của bé!');
                    return;
                  }
                  handleParentAction('change_parent_pin', { newParentPin: newParentPinInput });
                }}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs disabled:opacity-50"
              >
                Lưu Mã PIN Mới
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
