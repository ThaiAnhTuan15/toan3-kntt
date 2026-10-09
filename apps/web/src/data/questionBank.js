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
  1: { title: "Ôn tập các số đến 100 000 & Hàng, Lớp", stage: 1, category: "natural_num" },
  2: { title: "Số có nhiều chữ số (Triệu và Lớp triệu)", stage: 1, category: "natural_num" },
  3: { title: "So sánh số có nhiều chữ số & Làm tròn số", stage: 1, category: "natural_num" },
  4: { title: "Dãy số tự nhiên & Viết số trong hệ thập phân", stage: 1, category: "natural_num" },
  5: { title: "Đơn vị đo khối lượng (Yến, Tạ, Tấn) & Bảng đo", stage: 1, category: "measurement" },
  6: { title: "Đơn vị đo thời gian (Giây, Thế kỷ)", stage: 1, category: "measurement" },
  7: { title: "Góc nhọn, góc tù, góc bẹt", stage: 1, category: "geometry" },
  8: { title: "Hai đường thẳng vuông góc & Hai đường thẳng song song", stage: 1, category: "geometry" },
  9: { title: "Biểu thức có chứa chữ (Một, hai, ba chữ)", stage: 1, category: "natural_num" },
  10: { title: "Phép cộng, phép trừ & Tính chất giao hoán, kết hợp", stage: 2, category: "operations" },
  11: { title: "Tìm số trung bình cộng", stage: 2, category: "word_problems" },
  12: { title: "Bài toán: Tìm hai số khi biết Tổng và Hiệu", stage: 2, category: "word_problems" },
  13: { title: "Nhân với số có một chữ số & Nhân với 10, 100, 1000", stage: 2, category: "operations" },
  14: { title: "Tính chất giao hoán, kết hợp của phép nhân & Nhân 1 số với 1 tổng", stage: 2, category: "operations" },
  15: { title: "Nhân với số có hai, ba chữ số", stage: 2, category: "operations" },
  16: { title: "Chia cho số có một chữ số & Chia cho 10, 100, 1000", stage: 2, category: "operations" },
  17: { title: "Chia cho số có hai chữ số & Chia có dư", stage: 2, category: "operations" },
  18: { title: "Ôn tập & Đề thi thử Học kỳ 1 tổng hợp", stage: 2, category: "word_problems" },
  19: { title: "Khái niệm Phân số & Phân số và phép chia số tự nhiên", stage: 3, category: "fractions" },
  20: { title: "Phân số bằng nhau & Tính chất cơ bản của phân số", stage: 3, category: "fractions" },
  21: { title: "Rút gọn phân số & Quy đồng mẫu số các phân số", stage: 3, category: "fractions" },
  22: { title: "So sánh hai phân số cùng mẫu & khác mẫu số", stage: 3, category: "fractions" },
  23: { title: "Phép cộng phân số (Cùng mẫu và Khác mẫu)", stage: 3, category: "fractions" },
  24: { title: "Phép trừ phân số", stage: 3, category: "fractions" },
  25: { title: "Phép nhân phân số & Tìm phân số của một số", stage: 3, category: "fractions" },
  26: { title: "Phép chia phân số", stage: 3, category: "fractions" },
  27: { title: "Hình bình hành, Hình thoi & Diện tích", stage: 3, category: "geometry" },
  28: { title: "Đơn vị đo diện tích (dm², m², mm²)", stage: 4, category: "measurement" },
  29: { title: "Giới thiệu Tỉ số & Tỉ lệ", stage: 4, category: "word_problems" },
  30: { title: "Bài toán: Tìm hai số khi biết Tổng và Tỉ số", stage: 4, category: "word_problems" },
  31: { title: "Bài toán: Tìm hai số khi biết Hiệu và Tỉ số", stage: 4, category: "word_problems" },
  32: { title: "Tỉ lệ bản đồ và Ứng dụng thực tế", stage: 4, category: "word_problems" },
  33: { title: "Tổng ôn tập Số tự nhiên & Phân số", stage: 4, category: "natural_num" },
  34: { title: "Tổng ôn tập Hình học & Đại lượng đo lường", stage: 4, category: "geometry" },
  35: { title: "Đề thi thử Học kỳ 2 & Chinh phục Toán Lớp 4", stage: 4, category: "word_problems" }
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
