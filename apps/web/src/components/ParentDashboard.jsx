'use client';
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  RotateCcw, 
  Download,
  Calendar,
  Layers,
  ChevronRight,
  BookOpen,
  Calculator,
  Gift,
  Plus,
  Check,
  Send,
  XCircle,
  Flag
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const ParentDashboard = () => {
  const { 
    profile, 
    progress, 
    history, 
    totalStars, 
    coins, 
    piggyBalance,
    piggyHistory,
    piggyRequests,
    approveWithdrawal,
    rejectWithdrawal,
    manualAdjustPiggy,
    reportedQuestions,
    verifiedErrorIds,
    verifyQuestionError,
    rejectQuestionError,
    unverifyQuestionError,
    streakData,
    isMath,
    currentGrade,
    isGrade7,
    currentSubject,
    currentCategories,
    switchSubject
  } = useLearning();

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [errorFilter, setErrorFilter] = useState('pending'); // 'pending' | 'verified' | 'all'

  // Filter history by current grade & subject
  const subjectHistory = history.filter(h => {
    const matchGrade = !h.grade || h.grade === currentGrade;
    const matchSubject = !h.subject || h.subject === currentSubject;
    return matchGrade && matchSubject;
  });

  const subjectLabel = isGrade7
    ? (isMath ? 'Toán Lớp 7' : 'Ngữ Văn 7')
    : (isMath ? 'Toán Lớp 3' : 'Tiếng Việt 3');

  // Overall Statistics for current subject
  const totalQuizzes = subjectHistory.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(subjectHistory.reduce((sum, h) => sum + h.score, 0) / totalQuizzes)
    : 0;
  const perfectQuizzesCount = subjectHistory.filter(h => h.score === 100).length;
  const totalTimeSec = subjectHistory.reduce((sum, h) => sum + (h.timeSpent || 0), 0);
  const totalMinutes = Math.round(totalTimeSec / 60);

  // Topic Performance Analysis
  const topicStats = {};
  if (Array.isArray(currentCategories)) {
    currentCategories.forEach(cat => {
      topicStats[cat.id] = { total: 0, correct: 0 };
    });
  }

  subjectHistory.forEach(h => {
    if (h.details && Array.isArray(h.details)) {
      h.details.forEach(d => {
        const catKey = d.category || d.topic;
        if (catKey && topicStats[catKey]) {
          topicStats[catKey].total += 1;
          if (d.isCorrect) topicStats[catKey].correct += 1;
        }
      });
    }
  });

  // Calculate percentage and status for each topic
  const topicBreakdown = Array.isArray(currentCategories) ? currentCategories.map(cat => {
    const stat = topicStats[cat.id] || { total: 0, correct: 0 };
    const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
    
    let status = "Chưa làm bài";
    let statusColor = "text-slate-400 bg-slate-100";
    if (accuracy !== null) {
      if (accuracy >= 85) {
        status = "🌟 Xuất sắc";
        statusColor = "text-emerald-700 bg-emerald-50 border-emerald-300";
      } else if (accuracy >= 70) {
        status = "👍 Nắm vững";
        statusColor = "text-blue-700 bg-blue-50 border-blue-300";
      } else {
        status = "⚠️ Cần củng cố";
        statusColor = "text-amber-700 bg-amber-50 border-amber-300";
      }
    }

    return {
      ...cat,
      total: stat.total,
      correct: stat.correct,
      accuracy,
      status,
      statusColor
    };
  }) : [];

  // Find Strongest and Weakest areas
  const testedTopics = topicBreakdown.filter(t => t.accuracy !== null);
  const strongestTopic = testedTopics.length > 0 
    ? [...testedTopics].sort((a, b) => b.accuracy - a.accuracy)[0] 
    : null;
  const weakestTopic = testedTopics.length > 0 
    ? [...testedTopics].sort((a, b) => a.accuracy - b.accuracy)[0] 
    : null;

  // Handle Export Report (Print friendly window)
  const handleExportReport = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 print:p-0">
      {/* Top Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-bouncy flex flex-wrap items-center justify-between gap-4 ${
        isMath
          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
          : 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600'
      }`}>
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Góc Phụ Huynh & Phân Tích Năng Lực ({isMath ? 'Toán Học' : 'Tiếng Việt'})
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Báo Cáo Học Tập Của {profile.name} 📊
          </h1>
          <p className="text-xs sm:text-sm font-bold text-blue-100">
            Dữ liệu trực quan giúp phụ huynh nắm bắt chính xác điểm mạnh và phần kiến thức con cần rèn luyện thêm.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-white text-slate-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-bouncy-sm btn-bouncy flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            In Báo Cáo
          </button>
        </div>
      </div>

      {/* Key Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Tổng bài đã làm</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800">
            {totalQuizzes} <span className="text-xs font-semibold text-slate-400">bài</span>
          </div>
          <div className="text-[11px] font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {perfectQuizzesCount} bài đạt điểm 10
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Điểm trung bình</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800">
            {averageScore}%
          </div>
          <div className="text-[11px] font-extrabold text-slate-500 mt-1">
            {averageScore >= 80 ? '🌟 Học lực Giỏi' : averageScore >= 65 ? '👍 Học lực Khá' : '🌱 Cần cố gắng'}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Thời gian học tập</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800">
            {totalMinutes} <span className="text-xs font-semibold text-slate-400">phút</span>
          </div>
          <div className="text-[11px] font-extrabold text-amber-600 mt-1">
            Chuyên cần {streakData.currentStreak} ngày
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Ngôi sao tích lũy</span>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800">
            {totalStars} <span className="text-xs font-semibold text-slate-400">sao</span>
          </div>
          <div className="text-[11px] font-extrabold text-yellow-600 mt-1">
            {coins} Xu đổi thưởng
          </div>
        </div>
      </div>

      {/* AI Teacher Advice & Pedagogical Insights */}
      <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-3xl border-2 border-amber-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Nhận Xét & Lời Khuyên Của Giáo Viên {subjectLabel}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strength */}
          <div className="bg-white/80 rounded-2xl p-4 border border-amber-200/60 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Điểm mạnh nổi trội của bé:
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              {strongestTopic ? (
                <>Bé làm rất tốt chủ đề <span className="text-emerald-700 underline font-bold">{strongestTopic.name}</span> với độ chính xác đạt {strongestTopic.accuracy}%.</>
              ) : (
                <>Bé đang trong giai đoạn làm quen ban đầu. Hãy khuyến khích bé hoàn thành các bài trắc nghiệm Tuần 1 để hệ thống phân tích chi tiết!</>
              )}
            </p>
          </div>

          {/* Area to improve */}
          <div className="bg-white/80 rounded-2xl p-4 border border-amber-200/60 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              Chủ đề cần ưu tiên rèn luyện thêm:
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              {weakestTopic && weakestTopic.accuracy < 75 ? (
                <>Bé cần lưu ý thêm về <span className="text-amber-800 underline font-bold">{weakestTopic.name}</span> (đạt {weakestTopic.accuracy}%). Phụ huynh nên hướng dẫn bé xem lại phần 'Sửa Câu Sai' để nắm vững phương pháp.</>
              ) : (
                <>Năng lực học tập của bé đang tiến bộ rất đồng đều ở mọi mảng kiến thức. Hãy duy trì thói quen học 15 phút mỗi ngày!</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Category Competency Breakdown */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-bouncy space-y-6">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Đánh Giá Năng Lực Theo Chuẩn Kiến Thức & Kỹ Năng
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Tỷ lệ chính xác dựa trên lịch sử toàn bộ các câu hỏi trắc nghiệm đã làm
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {topicBreakdown.map((topic) => (
            <div key={topic.id} className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-800">{topic.name}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${topic.statusColor}`}>
                    {topic.status}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-600">
                  {topic.total > 0 ? (
                    <span>Đúng <strong className="text-slate-900">{topic.correct}</strong>/{topic.total} câu ({topic.accuracy}%)</span>
                  ) : (
                    <span className="text-slate-400">Chưa có dữ liệu</span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    (topic.accuracy || 0) >= 80 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                      : (topic.accuracy || 0) >= 60 
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500' 
                      : 'bg-gradient-to-r from-amber-400 to-orange-500'
                  }`}
                  style={{ width: `${topic.accuracy || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sổ Quỹ Heo Đất Tri Thức */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-6 shadow-bouncy space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl shadow-md shadow-pink-200">
              🐷
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                Sổ Quỹ Heo Đất Tri Thức
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-extrabold">
                  Tiền Thưởng Thực Tế
                </span>
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Theo dõi tích lũy, trao thưởng và duyệt yêu cầu mua đồ dùng học tập của bé
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Số Dư Hiện Tại</span>
              <span className="text-2xl sm:text-3xl font-black text-rose-600">
                {(piggyBalance || 0).toLocaleString('vi-VN')} <span className="text-base font-bold text-rose-500">đ</span>
              </span>
            </div>
            <button
              onClick={() => setShowAdjustModal(true)}
              className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm"
              title="Cộng thêm hoặc trừ bớt tiền trong heo đất"
            >
              <Plus className="w-4 h-4" />
              Điều Chỉnh
            </button>
          </div>
        </div>

        {/* Danh sách yêu cầu xin đổi quà đang chờ duyệt */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-500" />
            Yêu Cầu Xin Đổi Quà Đang Chờ Duyệt
            {piggyRequests?.filter(r => r.status?.toLowerCase() === 'pending').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {piggyRequests.filter(r => r.status?.toLowerCase() === 'pending').length}
              </span>
            )}
          </h3>

          {(!piggyRequests || piggyRequests.filter(r => r.status?.toLowerCase() === 'pending').length === 0) ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">
              Hiện tại bé chưa gửi yêu cầu xin đổi quà nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {piggyRequests.filter(r => r.status?.toLowerCase() === 'pending').map(req => (
                <div key={req.id} className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-black text-amber-800 block">
                        Bé xin rút: <span className="text-base text-rose-600 font-black">{req.amount.toLocaleString('vi-VN')} đ</span>
                      </span>
                      <p className="text-xs font-semibold text-slate-700 mt-1">
                        Mục đích: <strong className="text-slate-900 font-extrabold">{req.note || req.reason || 'Mua đồ dùng học tập'}</strong>
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1">
                        {new Date(req.date).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                    <button
                      onClick={() => {
                        approveWithdrawal(req.id);
                        sounds.playSuccess?.();
                      }}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Duyệt & Trao Quà
                    </button>
                    <button
                      onClick={() => {
                        rejectWithdrawal(req.id);
                        sounds.playClick?.();
                      }}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-600 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Từ Chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lịch sử giao dịch quỹ gần nhất */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Lịch Sử Thu - Chi Heo Đất Gần Nhất
          </h3>

          {(!piggyHistory || piggyHistory.length === 0) ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">
              Chưa có giao dịch thưởng hoặc rút tiền nào được ghi nhận.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {piggyHistory.slice(0, 10).map((h) => {
                const isEarn = h.type?.toLowerCase() === 'earn' || h.type === 'EARN';
                return (
                  <div key={h.id} className="p-3 bg-white flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {isEarn ? '🌟' : '🎁'}
                      </span>
                      <div>
                        <span className="font-extrabold text-slate-800 block">
                          {h.title || h.reason || (isEarn ? 'Thưởng bài học' : 'Lĩnh thưởng')}
                        </span>
                        {h.note && (
                          <span className="text-[11px] text-slate-500 font-semibold block">
                            {h.note}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(h.date).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <div className={`font-black text-sm whitespace-nowrap ${
                      isEarn ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isEarn ? `+${Math.abs(h.amount).toLocaleString('vi-VN')} đ` : `-${Math.abs(h.amount).toLocaleString('vi-VN')} đ`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Thẩm Định Câu Hỏi Báo Lỗi Từ Bé */}
      <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 shadow-bouncy space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-2xl shadow-md shadow-rose-200 text-white">
              🔍
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                Thẩm Định Câu Hỏi Báo Lỗi Từ Bé
                {reportedQuestions?.filter(r => r.status === 'pending').length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold animate-pulse">
                    {reportedQuestions.filter(r => r.status === 'pending').length} chờ duyệt
                  </span>
                )}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Xác nhận câu hỏi lỗi để thưởng bé <strong className="text-rose-600 font-black">+5.000 đ/lỗi</strong> và tự động loại trừ khỏi phạt trừ tiền Heo Đất
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-extrabold">
            <button
              onClick={() => setErrorFilter('pending')}
              className={`px-3 py-1.5 rounded-xl transition ${
                errorFilter === 'pending'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chờ Duyệt ({reportedQuestions?.filter(r => r.status === 'pending').length || 0})
            </button>
            <button
              onClick={() => setErrorFilter('verified')}
              className={`px-3 py-1.5 rounded-xl transition ${
                errorFilter === 'verified'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã Xác Nhận ({reportedQuestions?.filter(r => r.status === 'verified').length || 0})
            </button>
            <button
              onClick={() => setErrorFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                errorFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả ({reportedQuestions?.length || 0})
            </button>
          </div>
        </div>

        {/* Danh sách câu hỏi báo lỗi */}
        {(() => {
          const filteredReports = (reportedQuestions || []).filter(r => {
            if (errorFilter === 'pending') return r.status === 'pending';
            if (errorFilter === 'verified') return r.status === 'verified';
            return true;
          });

          if (filteredReports.length === 0) {
            return (
              <div className="py-8 text-center text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                {errorFilter === 'pending'
                  ? '🎉 Tuyệt vời! Hiện tại không có câu hỏi nào đang chờ phụ huynh thẩm định.'
                  : errorFilter === 'verified'
                  ? 'Chưa có câu hỏi nào được xác nhận là lỗi.'
                  : 'Bé chưa gửi báo lỗi câu hỏi nào.'}
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {filteredReports.map(rep => {
                const q = rep.question;
                const isPending = rep.status === 'pending';
                const isVerified = rep.status === 'verified';

                return (
                  <div 
                    key={rep.id} 
                    className={`rounded-2xl border-2 p-4 sm:p-5 transition-all shadow-sm space-y-4 ${
                      isPending 
                        ? 'bg-rose-50/40 border-rose-300' 
                        : isVerified 
                        ? 'bg-emerald-50/40 border-emerald-300' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Header Report Card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-black text-xs text-slate-800 shadow-2xs">
                          Mã câu: {rep.questionId}
                        </span>
                        {rep.week && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                            Đề Tuần {rep.week}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Báo lúc: {new Date(rep.reportedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      <div>
                        {isPending && (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs flex items-center gap-1">
                            <span>⏳</span> Đang Chờ Thẩm Định
                          </span>
                        )}
                        {isVerified && (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs flex items-center gap-1">
                            <span>✅</span> Đã Thưởng 5.000 đ & Miễn Trừ
                          </span>
                        )}
                        {rep.status === 'rejected' && (
                          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                            ✕ Câu Hỏi Chuẩn Xác
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lý do bé báo lỗi */}
                    <div className="bg-white p-3 rounded-xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-black text-rose-800 block">
                          Lý do bé báo: <span className="font-extrabold text-slate-800">{rep.reason}</span>
                        </span>
                        {rep.note && (
                          <p className="text-slate-600 font-semibold mt-0.5">
                            Ghi chú của con: <em>"{rep.note}"</em>
                          </p>
                        )}
                        {rep.adminNote && (
                          <p className="text-blue-700 font-semibold mt-0.5">
                            Lời dặn của Ba Mẹ: <em>"{rep.adminNote}"</em>
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px] shrink-0">
                        Thưởng công phát hiện: +5.000 đ 🎖️
                      </span>
                    </div>

                    {/* Chi tiết câu hỏi cần kiểm tra */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="text-sm sm:text-base font-extrabold text-slate-800">
                        <MathRenderer text={q.question} />
                      </div>

                      {/* Ảnh minh họa nếu có */}
                      {q.image ? (
                        <div className="flex justify-center my-2 p-2 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto">
                          <img 
                            src={q.image} 
                            alt="Hình minh họa câu hỏi" 
                            className="max-h-40 object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          (Câu hỏi này trong hệ thống không có file ảnh đính kèm)
                        </div>
                      )}

                      {/* 4 Đáp án */}
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isCorrectOpt = q.correctIndex === optIdx;
                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                                  isCorrectOpt
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-extrabold ring-1 ring-emerald-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                                    isCorrectOpt ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {['A', 'B', 'C', 'D'][optIdx]}
                                  </span>
                                  <span><MathRenderer text={opt} /></span>
                                </div>
                                {isCorrectOpt && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                    Đáp án hệ thống ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Hướng dẫn giải chi tiết */}
                      {q.explanation && (
                        <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200">
                          <strong className="text-amber-900 block mb-0.5">Lời giải hệ thống:</strong>
                          <MathRenderer text={q.explanation} />
                        </div>
                      )}
                    </div>

                    {/* Nút hành động thẩm định */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      {isPending && (
                        <>
                          <button
                            onClick={() => {
                              verifyQuestionError(rep.id, 5000);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-bouncy-sm transition flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            Xác Nhận Đúng Lỗi & Thưởng Bé 5.000 đ
                          </button>
                          <button
                            onClick={() => {
                              const note = prompt('Nhập lời dặn dò cho bé (tùy chọn):', 'Câu hỏi này chính xác con nhé, con đọc kỹ lại gợi ý và lời giải!');
                              rejectQuestionError(rep.id, note || '');
                            }}
                            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Câu Hỏi Chuẩn (Bỏ Qua)
                          </button>
                        </>
                      )}

                      {isVerified && (
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn hoàn tác xác nhận lỗi cho câu hỏi này không?')) {
                              unverifyQuestionError(rep.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                        >
                          Hoàn tác xác nhận
                        </button>
                      )}

                      {rep.status === 'rejected' && (
                        <button
                          onClick={() => {
                            verifyQuestionError(rep.id, 5000);
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition"
                        >
                          Đổi ý: Xác nhận câu lỗi & Thưởng 5.000 đ
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-bouncy space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Lịch Sử 5 Bài Luyện Tập Gần Nhất
        </h2>

        {subjectHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-bold text-sm">
            Chưa có bài luyện tập nào được ghi nhận. Hãy bắt đầu từ Tuần 1 nhé!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-400">
                  <th className="py-2.5 px-3">Thời Gian</th>
                  <th className="py-2.5 px-3">Tên Bài Thi / Tuần</th>
                  <th className="py-2.5 px-3">Điểm Số</th>
                  <th className="py-2.5 px-3">Kết Quả</th>
                  <th className="py-2.5 px-3">Sao Tích Lũy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subjectHistory.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(item.date).toLocaleDateString('vi-VN')} {new Date(item.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-800">
                      {item.week ? `Tuần ${item.week}` : 'Luyện tập tùy chọn'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        item.score >= 90 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : item.score >= 70 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.score}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      Đúng {item.correctCount}/{item.totalCount} câu
                    </td>
                    <td className="py-3 px-3 text-amber-500 font-bold flex items-center gap-1">
                      +{item.earnedStars} ⭐
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Điều Chỉnh Quỹ */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-pink-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                <span>🐷</span> Điều Chỉnh Quỹ Heo Đất
              </h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseInt(adjustAmount, 10);
                if (isNaN(amt) || amt === 0) {
                  alert('Vui lòng nhập số tiền hợp lệ (ví dụ: 10000 hoặc -10000)');
                  return;
                }
                if (!adjustReason.trim()) {
                  alert('Vui lòng nhập lý do điều chỉnh');
                  return;
                }
                manualAdjustPiggy(amt, adjustReason.trim());
                setAdjustAmount('');
                setAdjustReason('');
                setShowAdjustModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Số tiền cần điều chỉnh (VNĐ):
                </label>
                <input
                  type="number"
                  step="1000"
                  placeholder="VD: 20000 (cộng thêm) hoặc -20000 (trừ đi)"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 font-black text-slate-800 text-sm focus:border-pink-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  * Nhập số dương để thưởng thêm, nhập số âm để trừ bớt (khi đã mua quà trực tiếp).
                </span>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Lý do điều chỉnh:
                </label>
                <input
                  type="text"
                  placeholder="VD: Ba mẹ thưởng thêm làm việc nhà chăm chỉ..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-800 text-xs focus:border-pink-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs shadow-md shadow-pink-200"
                >
                  Xác Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

