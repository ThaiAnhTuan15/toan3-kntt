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
  1: { title: "Ôn tập các số đến 1000", stage: 1, category: "natural_num" },
  2: { title: "Ôn tập phép cộng, phép trừ trong phạm vi 1000", stage: 1, category: "operations" },
  3: { title: "Tìm thành phần trong phép cộng, phép trừ", stage: 1, category: "operations" },
  4: { title: "Ôn tập bảng nhân 2; 5, bảng chia 2; 5", stage: 1, category: "operations" },
  5: { title: "Bảng nhân 3, bảng chia 3", stage: 1, category: "operations" },
  6: { title: "Bảng nhân 4, bảng chia 4", stage: 1, category: "operations" },
  7: { title: "Ôn tập hình học và đo lường", stage: 1, category: "geometry" },
  8: { title: "Luyện tập chung: Ôn tập và Bổ sung", stage: 1, category: "natural_num" },
  9: { title: "Bảng nhân 6, bảng chia 6", stage: 1, category: "operations" },
  10: { title: "Bảng nhân 7, bảng chia 7", stage: 2, category: "operations" },
  11: { title: "Bảng nhân 8, bảng chia 8", stage: 2, category: "operations" },
  12: { title: "Bảng nhân 9, bảng chia 9", stage: 2, category: "operations" },
  13: { title: "Tìm thành phần trong phép nhân, phép chia", stage: 2, category: "operations" },
  14: { title: "Một phần mấy", stage: 2, category: "fractions" },
  15: { title: "Luyện tập chung: Bảng nhân, bảng chia", stage: 2, category: "operations" },
  16: { title: "Điểm ở giữa, trung điểm của đoạn thẳng", stage: 2, category: "geometry" },
  17: { title: "Hình tròn. Tâm, bán kính, đường kính", stage: 2, category: "geometry" },
  18: { title: "Góc, góc vuông, góc không vuông", stage: 2, category: "geometry" },
  19: { title: "Hình tam giác, tứ giác, chữ nhật, hình vuông", stage: 3, category: "geometry" },
  20: { title: "Thực hành vẽ hình phẳng", stage: 3, category: "geometry" },
  21: { title: "Khối lập phương, khối hộp chữ nhật", stage: 3, category: "geometry" },
  22: { title: "Luyện tập chung: Hình phẳng, Hình khối", stage: 3, category: "geometry" },
  23: { title: "Nhân số có 2 chữ số với số có 1 chữ số", stage: 3, category: "operations" },
  24: { title: "Gấp một số lên một số lần", stage: 3, category: "word_problems" },
  25: { title: "Phép chia hết, phép chia có dư", stage: 3, category: "operations" },
  26: { title: "Chia số có 2 chữ số cho số có 1 chữ số", stage: 3, category: "operations" },
  27: { title: "Giảm một số đi một số lần", stage: 3, category: "word_problems" },
  28: { title: "Bài toán giải bằng hai bước tính", stage: 4, category: "word_problems" },
  29: { title: "Luyện tập chung: Phép nhân, chia", stage: 4, category: "operations" },
  30: { title: "Mi-li-mét", stage: 4, category: "measurement" },
  31: { title: "Gam", stage: 4, category: "measurement" },
  32: { title: "Mi-li-lít", stage: 4, category: "measurement" },
  33: { title: "Nhiệt độ. Đơn vị đo nhiệt độ", stage: 4, category: "measurement" },
  34: { title: "Thực hành đo lường", stage: 4, category: "measurement" },
  35: { title: "Luyện tập chung cuối năm", stage: 4, category: "word_problems" }
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
