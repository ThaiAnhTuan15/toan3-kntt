'use client';
import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Sparkles, 
  Clock, 
  Filter, 
  Check, 
  Play,
  Flame,
  Zap,
  BookMarked
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const CustomPractice = ({ onStartQuiz }) => {
  const { 
    isMath, 
    currentGrade,
    isGrade7,
    currentSubject, 
    currentStages, 
    currentCategories, 
    currentBank, 
    getFilteredQuestions 
  } = useLearning();

  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [isTimed, setIsTimed] = useState(true);

  const subjectLabel = isGrade7
    ? (isMath ? 'Toán Lớp 7' : 'Ngữ Văn 7')
    : (isMath ? 'Toán Lớp 4' : 'Tiếng Việt 4');

  // Quick Exam Presets
  const handleStartPreset = (presetType) => {
    sounds.playClick();
    let title = "";
    let filteredQuestions = [];
    let timeLimit = 900;

    if (presetType === 'hk1') {
      title = `Đề Thi Thử Học Kỳ 1 (${subjectLabel} Tổng Hợp)`;
      filteredQuestions = getFilteredQuestions({ semester: 1, count: 20 });
      timeLimit = 1200; // 20 mins
    } else if (presetType === 'hk2') {
      title = `Đề Thi Thử Học Kỳ 2 (${subjectLabel} Chuẩn GDPT)`;
      filteredQuestions = getFilteredQuestions({ semester: 2, count: 20 });
      timeLimit = 1200;
    } else if (presetType === 'speed') {
      title = isMath 
        ? `Thử Thách Tính Nhanh 10 Phút (${subjectLabel})` 
        : `Thử Thách Đọc Hiểu & Phản Xạ 10 Phút (${subjectLabel})`;
      filteredQuestions = getFilteredQuestions({ difficulty: 'all', count: 10 });
      timeLimit = 600; // 10 mins
    } else if (presetType === 'hard_core') {
      title = isMath 
        ? `Đấu Trường Thần Đồng Toán (${subjectLabel} - Chuyên Đề Nâng Cao)` 
        : `Đấu Trường Cảm Thụ & Ngữ Văn (${subjectLabel} Nâng Cao)`;
      filteredQuestions = getFilteredQuestions({ difficulty: 'hard', count: 15 });
      timeLimit = 1200;
    }

    onStartQuiz({
      type: 'custom',
      title,
      questions: filteredQuestions,
      timeLimitSec: timeLimit
    });
  };

  const handleStartCustom = () => {
    sounds.playClick();
    const questions = getFilteredQuestions({
      semester: selectedSemester,
      stage: selectedStage,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      count: questionCount
    });

    if (questions.length === 0) {
      alert("Không tìm thấy câu hỏi phù hợp với bộ lọc. Hãy nới lỏng điều kiện lọc!");
      return;
    }

    onStartQuiz({
      type: 'custom',
      title: `Luyện Tập Tùy Chọn ${subjectLabel} (${questions.length} câu)`,
      questions,
      timeLimitSec: isTimed ? questionCount * 60 : 3600
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Header */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-bouncy ${
        isMath
          ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500'
          : 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500'
      }`}>
        <div className="max-w-2xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Phòng Luyện Thi & Tùy Chọn Đề
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            {isMath ? 'Đấu Trường Luyện Thi Toán Lớp 4 🎯' : 'Đấu Trường Luyện Thi Tiếng Việt 4 🎯'}
          </h1>
          <p className="text-sm sm:text-base font-bold text-teal-50">
            Lựa chọn các bộ đề thi thử Học Kỳ chuẩn hoặc tự thiết kế phòng luyện tập theo từng chủ đề yêu thích!
          </p>
        </div>
      </div>

      {/* Quick Presets Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Bộ Đề Thi Thử Nổi Bật ({isMath ? 'Toán Học' : 'Tiếng Việt'})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* HK1 Mock */}
          <div 
            onClick={() => handleStartPreset('hk1')}
            className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-sm hover:shadow-md hover:border-emerald-500 cursor-pointer group transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="font-extrabold text-base text-slate-800 group-hover:text-emerald-700 mb-1">
                Đề Thi Học Kỳ 1
              </h3>
              <p className="text-xs text-slate-500 font-semibold mb-3">
                {isMath 
                  ? 'Tổng hợp Số tự nhiên, Phép tính, Trung bình cộng, Tổng-Hiệu.' 
                  : 'Tổng hợp Cấu tạo tiếng, Từ loại, Câu kể, Trạng ngữ và Đọc hiểu.'}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-3 border-t border-slate-100">
              <span>20 Câu • 20 Phút</span>
              <span className="group-hover:translate-x-1 transition-transform">Bắt đầu →</span>
            </div>
          </div>

          {/* HK2 Mock */}
          <div 
            onClick={() => handleStartPreset('hk2')}
            className="bg-white rounded-2xl border-2 border-blue-300 p-5 shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer group transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 className="font-extrabold text-base text-slate-800 group-hover:text-blue-700 mb-1">
                Đề Thi Học Kỳ 2
              </h3>
              <p className="text-xs text-slate-500 font-semibold mb-3">
                {isMath 
                  ? 'Bao quát Phân số, Hình bình hành, Hình thoi, Tổng-Tỉ, Hiệu-Tỉ.' 
                  : 'Bao quát Từ đồng nghĩa, Câu cảm/khiến, Điệp ngữ, Thành ngữ và Văn bản.'}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 pt-3 border-t border-slate-100">
              <span>20 Câu • 20 Phút</span>
              <span className="group-hover:translate-x-1 transition-transform">Bắt đầu →</span>
            </div>
          </div>

          {/* Speed Challenge */}
          <div 
            onClick={() => handleStartPreset('speed')}
            className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm hover:shadow-md hover:border-amber-500 cursor-pointer group transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="font-extrabold text-base text-slate-800 group-hover:text-amber-700 mb-1">
                Tốc Chiến 10 Phút
              </h3>
              <p className="text-xs text-slate-500 font-semibold mb-3">
                Rèn luyện khả năng phản xạ nhanh, độ chuẩn xác dưới áp lực thời gian.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-600 pt-3 border-t border-slate-100">
              <span>10 Câu • 10 Phút</span>
              <span className="group-hover:translate-x-1 transition-transform">Bắt đầu →</span>
            </div>
          </div>

          {/* Hardcore Master */}
          <div 
            onClick={() => handleStartPreset('hard_core')}
            className="bg-white rounded-2xl border-2 border-purple-300 p-5 shadow-sm hover:shadow-md hover:border-purple-500 cursor-pointer group transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform">
                🔥
              </div>
              <h3 className="font-extrabold text-base text-slate-800 group-hover:text-purple-700 mb-1">
                Chuyên Nâng Cao
              </h3>
              <p className="text-xs text-slate-500 font-semibold mb-3">
                {isMath 
                  ? 'Tuyển tập các bài toán đố tư duy hóc búa để chinh phục điểm 10.' 
                  : 'Tuyển tập các bài tập cảm thụ thơ văn và ngữ pháp nâng cao đạt điểm 10.'}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-purple-600 pt-3 border-t border-slate-100">
              <span>15 Câu Khó • 20 Phút</span>
              <span className="group-hover:translate-x-1 transition-transform">Bắt đầu →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Test Builder */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-bouncy space-y-6">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Thiết Kế Phòng Luyện Tập Tùy Chọn 🛠️
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
              Tùy biến học kỳ, chặng học, chủ đề kiến thức và độ khó theo nhu cầu của bé
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            Tổng kho: {currentBank.length} câu hỏi
          </span>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Semester Filter */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">Học kỳ:</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-amber-400 focus:outline-none bg-slate-50"
            >
              <option value="all">Toàn bộ năm học (Học kỳ 1 & 2)</option>
              <option value="1">Học kỳ 1 (Tuần 1 - 18)</option>
              <option value="2">Học kỳ 2 (Tuần 19 - 35)</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">Chặng học tập:</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-amber-400 focus:outline-none bg-slate-50"
            >
              <option value="all">Tất cả các chặng</option>
              {currentStages.map((s) => (
                <option key={s.id} value={s.id}>
                  Chặng {s.id}: {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">Chủ đề kiến thức:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-amber-400 focus:outline-none bg-slate-50"
            >
              <option value="all">Tất cả chủ đề</option>
              {currentCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">Độ khó:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-amber-400 focus:outline-none bg-slate-50"
            >
              <option value="all">Tổng hợp mọi mức độ</option>
              <option value="easy">Mức độ Dễ (Khởi động)</option>
              <option value="medium">Mức độ Trung bình (Thông hiểu)</option>
              <option value="hard">Mức độ Nâng cao (Điểm 10)</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">Số lượng câu hỏi:</label>
            <div className="flex items-center gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all border-2 ${
                    questionCount === num
                      ? isMath
                        ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                        : 'bg-rose-500 border-rose-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>

          {/* Timer Toggle */}
          <div>
            <label className="block text-xs font-extrabold text-slate-600 mb-2">Tính giờ làm bài:</label>
            <button
              type="button"
              onClick={() => setIsTimed(!isTimed)}
              className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-between border-2 transition-all ${
                isTimed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {isTimed ? `Bật tính giờ (${questionCount} phút)` : 'Tắt (Làm thoải mái)'}
              </span>
              <span className="font-bold text-xs">{isTimed ? 'BẬT' : 'TẮT'}</span>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleStartCustom}
            className={`px-8 py-3.5 font-bold text-sm rounded-2xl shadow-bouncy btn-bouncy flex items-center gap-2 ${
              isMath 
                ? 'bg-amber-400 hover:bg-amber-500 text-amber-950' 
                : 'bg-rose-500 hover:bg-rose-600 text-white'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            Tạo Đề & Bắt Đầu Luyện Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

