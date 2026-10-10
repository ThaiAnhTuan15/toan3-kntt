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
  Calculator
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const ParentDashboard = () => {
  const { 
    profile, 
    progress, 
    history, 
    totalStars, 
    coins, 
    streakData,
    isMath,
    currentGrade,
    isGrade7,
    currentSubject,
    currentCategories,
    switchSubject
  } = useLearning();

  // Filter history by current grade & subject
  const subjectHistory = history.filter(h => {
    const matchGrade = !h.grade || h.grade === currentGrade;
    const matchSubject = !h.subject || h.subject === currentSubject;
    return matchGrade && matchSubject;
  });

  const subjectLabel = isGrade7
    ? (isMath ? 'Toán Lớp 7' : 'Ngữ Văn 7')
    : (isMath ? 'Toán Lớp 4' : 'Tiếng Việt 4');

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
  currentCategories.forEach(cat => {
    topicStats[cat.id] = { total: 0, correct: 0 };
  });

  subjectHistory.forEach(h => {
    if (h.details && Array.isArray(h.details)) {
      h.details.forEach(d => {
        if (d.category && topicStats[d.category]) {
          topicStats[d.category].total += 1;
          if (d.isCorrect) topicStats[d.category].correct += 1;
        }
      });
    }
  });

  // Calculate percentage and status for each topic
  const topicBreakdown = currentCategories.map(cat => {
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
  });

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
          Nhận Xét & Lời Khuyên Của Giáo Viên {isMath ? 'Toán Lớp 4' : 'Tiếng Việt 4'}
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
    </div>
  );
};

