// NGÂN HÀNG CÂU HỎI TOÁN LỚP 4 - CHUẨN CHƯƠNG TRÌNH GDPT MỚI
// 35 TUẦN HỌC - 4 CHẶNG PHIÊU LƯU - 350+ CÂU HỎI (MỖI TUẦN TỐI THIỂU 10 CÂU, TỐI THIỂU 5 CÂU KHÓ/NÂNG CAO)

import { STAGE_1_QUESTIONS } from './stages/stage1';
import { STAGE_2_QUESTIONS } from './stages/stage2';
import { STAGE_3_QUESTIONS } from './stages/stage3';
import { STAGE_4_QUESTIONS } from './stages/stage4';

export const STAGES = [
  {
    id: 1,
    title: "Chặng 1: Khởi động & Số tự nhiên",
    subtitle: "Tuần 1 - Tuần 9",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    semester: 1,
    icon: "Rocket",
    color: "from-amber-400 to-orange-500",
    badge: "Vệ binh Số tự nhiên",
    description: "Ôn tập số nhiều chữ số, hàng và lớp, biểu thức chứa chữ, đơn vị đo và góc hình học."
  },
  {
    id: 2,
    title: "Chặng 2: Phép tính nâng cao & Dạng toán có lời văn",
    subtitle: "Tuần 10 - Tuần 18 (Ôn thi HK1)",
    weeks: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    semester: 1,
    icon: "Target",
    color: "from-emerald-400 to-teal-600",
    badge: "Bậc thầy Tính toán HK1",
    description: "Nhân chia nhiều chữ số, Trung bình cộng, Tổng và Hiệu, diện tích dm², m² và Đề thi HK1."
  },
  {
    id: 3,
    title: "Chặng 3: Khám phá Phân số & Hình học phẳng",
    subtitle: "Tuần 19 - Tuần 27",
    weeks: [19, 20, 21, 22, 23, 24, 25, 26, 27],
    semester: 2,
    icon: "Sparkles",
    color: "from-cyan-400 to-blue-600",
    badge: "Nhà thám hiểm Phân số",
    description: "Khái niệm phân số, rút gọn, quy đồng, 4 phép tính phân số, hình bình hành, hình thoi."
  },
  {
    id: 4,
    title: "Chặng 4: Tỉ số, Toán tư duy & Tổng ôn cuối năm",
    subtitle: "Tuần 28 - Tuần 35 (Ôn thi HK2)",
    weeks: [28, 29, 30, 31, 32, 33, 34, 35],
    semester: 2,
    icon: "Trophy",
    color: "from-purple-500 to-pink-500",
    badge: "Thần đồng Toán học Toàn năng",
    description: "Tỉ số, bài toán Tổng - Tỉ, Hiệu - Tỉ, tỉ lệ bản đồ và Đề thi tổng hợp HK2."
  }
];

export const TOPIC_CATEGORIES = [
  { id: "natural_num", name: "Số tự nhiên & Biểu thức", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "operations", name: "4 Phép tính nâng cao", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "fractions", name: "Phân số & Phép tính phân số", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "geometry", name: "Hình học & Góc", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "measurement", name: "Đại lượng & Đo lường", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "word_problems", name: "Toán có lời văn & Tỉ số", color: "bg-rose-100 text-rose-800 border-rose-300" }
];

export const WEEKS_METADATA = {
  // HỌC KỲ 1 (Tập 1 - 44 Bài)
  1: { title: "Ôn tập các số đến 1000 & Phép cộng trừ", subject: "math", category: "natural_num", desc: "Bài 1, 2" },
  2: { title: "Tìm thành phần trong phép cộng trừ & Ôn bảng nhân chia", subject: "math", category: "operations", desc: "Bài 3, 4" },
  3: { title: "Bảng nhân chia 3 và 4", subject: "math", category: "operations", desc: "Bài 5, 6" },
  4: { title: "Ôn tập hình học, đo lường & Luyện tập chung", subject: "math", category: "geometry", desc: "Bài 7, 8" },
  
  5: { title: "Bảng nhân chia 6 và 7", subject: "math", category: "operations", desc: "Bài 9, 10" },
  6: { title: "Bảng nhân chia 8 và 9", subject: "math", category: "operations", desc: "Bài 11, 12" },
  7: { title: "Tìm thành phần phép nhân chia & Phân số", subject: "math", category: "fractions", desc: "Bài 13, 14, 15" },
  
  8: { title: "Điểm ở giữa, trung điểm & Hình tròn", subject: "math", category: "geometry", desc: "Bài 16, 17" },
  9: { title: "Góc, Góc vuông & Hình phẳng", subject: "math", category: "geometry", desc: "Bài 18, 19, 20" },
  10: { title: "Hình khối & Luyện tập chung", subject: "math", category: "geometry", desc: "Bài 21, 22" },
  
  11: { title: "Nhân chia số có hai chữ số (phần 1)", subject: "math", category: "operations", desc: "Bài 23, 24" },
  12: { title: "Phép chia hết, chia có dư & Chia số có hai chữ số (phần 2)", subject: "math", category: "operations", desc: "Bài 25, 26" },
  13: { title: "Giảm một số đi một số lần & Bài toán hai bước tính", subject: "math", category: "operations", desc: "Bài 27, 28, 29" },
  
  14: { title: "Mi-li-mét, Gam & Mi-li-lít", subject: "math", category: "measurement", desc: "Bài 30, 31, 32" },
  15: { title: "Nhiệt độ & Luyện tập đo lường", subject: "math", category: "measurement", desc: "Bài 33, 34, 35" },
  
  16: { title: "Nhân chia số có ba chữ số (phần 1)", subject: "math", category: "operations", desc: "Bài 36, 37" },
  17: { title: "Biểu thức số & So sánh số lớn gấp mấy lần số bé", subject: "math", category: "operations", desc: "Bài 38, 39, 40" },
  
  18: { title: "Ôn tập Học Kì 1", subject: "math", category: "exam", desc: "Bài 41, 42, 43, 44" },
  
  // HỌC KỲ 2 (Tập 2)
  19: { title: "Các số có bốn chữ số", subject: "math", category: "natural_num", desc: "Tập 2" },
  20: { title: "Phép cộng, trừ trong phạm vi 10 000", subject: "math", category: "operations", desc: "Tập 2" },
  21: { title: "Phép nhân, chia trong phạm vi 10 000", subject: "math", category: "operations", desc: "Tập 2" },
  22: { title: "Tháng - Năm, Xem đồng hồ", subject: "math", category: "measurement", desc: "Tập 2" },
  23: { title: "Tiền Việt Nam", subject: "math", category: "measurement", desc: "Tập 2" },
  24: { title: "Làm quen với thống kê số liệu", subject: "math", category: "statistics", desc: "Tập 2" },
  25: { title: "Diện tích của một hình", subject: "math", category: "geometry", desc: "Tập 2" },
  26: { title: "Các số có năm chữ số", subject: "math", category: "natural_num", desc: "Tập 2" },
  27: { title: "Phép cộng, trừ trong phạm vi 100 000", subject: "math", category: "operations", desc: "Tập 2" },
  28: { title: "Phép nhân, chia trong phạm vi 100 000", subject: "math", category: "operations", desc: "Tập 2" },
  29: { title: "Chu vi hình chữ nhật, hình vuông", subject: "math", category: "geometry", desc: "Tập 2" },
  30: { title: "Diện tích hình chữ nhật, hình vuông", subject: "math", category: "geometry", desc: "Tập 2" },
  31: { title: "Khả năng xảy ra của một sự kiện", subject: "math", category: "statistics", desc: "Tập 2" },
  32: { title: "Ôn tập các số trong phạm vi 100 000", subject: "math", category: "exam", desc: "Tập 2" },
  33: { title: "Ôn tập bốn phép tính", subject: "math", category: "exam", desc: "Tập 2" },
  34: { title: "Ôn tập hình học và đo lường", subject: "math", category: "exam", desc: "Tập 2" },
  35: { title: "Ôn tập cuối năm", subject: "math", category: "exam", desc: "Tập 2" }
};

// Combine all 350+ questions across 4 stages
export const QUESTION_BANK = [
  ...STAGE_1_QUESTIONS,
  ...STAGE_2_QUESTIONS,
  ...STAGE_3_QUESTIONS,
  ...STAGE_4_QUESTIONS
];

// Helper to get questions for a specific week
export const getQuestionsByWeek = (week) => {
  return QUESTION_BANK.filter(q => q.week === Number(week));
};

// Helper to get questions by filter
export const getFilteredQuestions = ({ week, semester, stage, difficulty, category, count = 10 }) => {
  let list = [...QUESTION_BANK];
  if (week && week !== 'all') {
    list = list.filter(q => q.week === Number(week));
  }
  if (stage && stage !== 'all') {
    list = list.filter(q => q.stage === Number(stage));
  }
  if (semester && semester !== 'all') {
    list = list.filter(q => q.semester === Number(semester));
  }
  if (difficulty && difficulty !== 'all') {
    list = list.filter(q => q.difficulty === difficulty);
  }
  if (category && category !== 'all') {
    list = list.filter(q => q.category === category);
  }

  // Shuffle list
  const shuffled = list.sort(() => 0.5 - Math.random());
  return count ? shuffled.slice(0, count) : shuffled;
};
