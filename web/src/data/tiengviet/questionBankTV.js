// NGÂN HÀNG CÂU HỎI TIẾNG VIỆT LỚP 4 - CHUẨN CHƯƠNG TRÌNH GDPT MỚI
// 35 TUẦN HỌC - 4 CHẶNG KHÁM PHÁ - 350+ CÂU HỎI (MỖI TUẦN TỐI THIỂU 10 CÂU, TỐI THIỂU 5 CÂU NÂNG CAO/CẢM THỤ)

import { STAGE_1_TV_QUESTIONS } from './stages/stage1_tv';
import { STAGE_2_TV_QUESTIONS } from './stages/stage2_tv';
import { STAGE_3_TV_QUESTIONS } from './stages/stage3_tv';
import { STAGE_4_TV_QUESTIONS } from './stages/stage4_tv';

export const STAGES_TV = [
  {
    id: 1,
    title: "Chặng 1: Khởi động, Thế giới Tu từ & Từ loại",
    subtitle: "Tuần 1 - Tuần 9",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    semester: 1,
    icon: "BookOpen",
    color: "from-rose-400 to-pink-600",
    badge: "Vệ binh Tiếng Việt",
    description: "Cấu tạo tiếng, từ đơn - từ phức, danh từ, động từ, tính từ, so sánh, nhân hóa và dấu câu."
  },
  {
    id: 2,
    title: "Chặng 2: Mở rộng Vốn từ, Cụm từ & Luyện câu",
    subtitle: "Tuần 10 - Tuần 18 (Ôn thi HK1)",
    weeks: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    semester: 1,
    icon: "Feather",
    color: "from-amber-400 to-orange-600",
    badge: "Bậc thầy Ngữ pháp HK1",
    description: "Chủ ngữ, vị ngữ, câu kể (Ai làm gì?, Ai thế nào?, Ai là gì?), các loại trạng ngữ và Đề thi HK1."
  },
  {
    id: 3,
    title: "Chặng 3: Khám phá Văn bản, Từ đồng nghĩa & Cảm thụ",
    subtitle: "Tuần 19 - Tuần 27",
    weeks: [19, 20, 21, 22, 23, 24, 25, 26, 27],
    semester: 2,
    icon: "Sparkles",
    color: "from-emerald-400 to-teal-600",
    badge: "Nhà văn Nhí Tài ba",
    description: "Từ đồng nghĩa, từ trái nghĩa, từ nhiều nghĩa, câu cảm, câu khiến, điệp ngữ và miêu tả cây cối, con vật."
  },
  {
    id: 4,
    title: "Chặng 4: Thành ngữ, Tục ngữ & Tổng ôn Toàn diện",
    subtitle: "Tuần 28 - Tuần 35 (Ôn thi HK2)",
    weeks: [28, 29, 30, 31, 32, 33, 34, 35],
    semester: 2,
    icon: "Trophy",
    color: "from-indigo-500 to-purple-600",
    badge: "Thần đồng Tiếng Việt Toàn năng",
    description: "Thành ngữ tục ngữ, liên kết câu, quy tắc chính tả, văn bản thông tin và Đề thi tổng hợp HK2."
  }
];

export const TOPIC_CATEGORIES_TV = [
  { id: "reading", name: "Đọc hiểu & Cảm thụ văn học", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "grammar", name: "Luyện từ và câu (Ngữ pháp)", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "rhetoric", name: "Biện pháp nghệ thuật & Tu từ", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "spelling", name: "Quy tắc chính tả & Âm vần", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "vocabulary", name: "Mở rộng vốn từ ngữ", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "idioms", name: "Thành ngữ & Tục ngữ Việt Nam", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "writing", name: "Tập làm văn & Đoạn văn", color: "bg-teal-100 text-teal-800 border-teal-300" }
];

export const WEEKS_METADATA_TV = {
  1: { title: "Cấu tạo của tiếng (Âm đầu, Vần, Thanh)", stage: 1, category: "grammar" },
  2: { title: "Từ đơn và Từ phức (Từ ghép & Từ láy)", stage: 1, category: "grammar" },
  3: { title: "Danh từ (Danh từ chung, Danh từ riêng & Viết hoa)", stage: 1, category: "grammar" },
  4: { title: "Động từ (Chỉ hoạt động & Chỉ trạng thái)", stage: 1, category: "grammar" },
  5: { title: "Tính từ (Đặc điểm, tính chất & Mức độ)", stage: 1, category: "grammar" },
  6: { title: "Biện pháp tu từ: So sánh & Tác dụng gợi cảm", stage: 1, category: "rhetoric" },
  7: { title: "Biện pháp tu từ: Nhân hóa (3 cách nhân hóa)", stage: 1, category: "rhetoric" },
  8: { title: "Dấu câu: Dấu gạch ngang, Dấu hai chấm, Dấu ngoặc kép", stage: 1, category: "grammar" },
  9: { title: "Ôn tập giữa HK1 & Kỹ năng Đọc hiểu cảm thụ", stage: 1, category: "reading" },
  10: { title: "Vị ngữ trong câu kể (Đặc điểm & Cấu tạo)", stage: 2, category: "grammar" },
  11: { title: "Chủ ngữ trong câu kể (Khái niệm & Phân loại)", stage: 2, category: "grammar" },
  12: { title: "Mở rộng vốn từ: Ý chí - Nghị lực, Nhân hậu - Đoàn kết", stage: 2, category: "vocabulary" },
  13: { title: "Câu kể: Ai làm gì? (Đặc điểm & Ứng dụng)", stage: 2, category: "grammar" },
  14: { title: "Câu kể: Ai thế nào? (Miêu tả đặc điểm)", stage: 2, category: "grammar" },
  15: { title: "Câu kể: Ai là gì? (Giới thiệu & Nhận định)", stage: 2, category: "grammar" },
  16: { title: "Trạng ngữ trong câu: Nơi chốn & Thời gian", stage: 2, category: "grammar" },
  17: { title: "Trạng ngữ chỉ Nguyên nhân, Mục đích, Phương tiện", stage: 2, category: "grammar" },
  18: { title: "Đề thi thử Học kỳ 1 Tiếng Việt Lớp 4 (Tổng hợp)", stage: 2, category: "reading" },
  19: { title: "Từ đồng nghĩa, Từ trái nghĩa & Sắc thái biểu cảm", stage: 3, category: "vocabulary" },
  20: { title: "Từ nhiều nghĩa (Phân biệt Nghĩa gốc & Nghĩa chuyển)", stage: 3, category: "vocabulary" },
  21: { title: "Câu cảm & Câu khiến (Dấu hiệu & Cách đặt câu)", stage: 3, category: "grammar" },
  22: { title: "Biện pháp tu từ: Điệp từ, Điệp ngữ trong thơ văn", stage: 3, category: "rhetoric" },
  23: { title: "Dấu câu: Dấu gạch nối & Dấu ngoặc đơn", stage: 3, category: "grammar" },
  24: { title: "Mở rộng vốn từ: Cái đẹp, Sức khỏe, Dũng cảm", stage: 3, category: "vocabulary" },
  25: { title: "Luyện tập Đoạn văn biểu cảm & Miêu tả cây cối", stage: 3, category: "writing" },
  26: { title: "Đoạn văn miêu tả con vật & Các biện pháp tu từ", stage: 3, category: "writing" },
  27: { title: "Ôn tập giữa HK2 & Kỹ năng cảm thụ thơ văn", stage: 3, category: "reading" },
  28: { title: "Thành ngữ & Tục ngữ Việt Nam (Giải nghĩa & Ứng dụng)", stage: 4, category: "idioms" },
  29: { title: "Mở rộng vốn từ: Du lịch - Thám hiểm, Lạc quan - Yêu đời", stage: 4, category: "vocabulary" },
  30: { title: "Liên kết câu bằng cách Lặp từ ngữ & Thay thế từ ngữ", stage: 4, category: "grammar" },
  31: { title: "Quy tắc chính tả (l/n, s/x, ch/tr, d/gi/r, hỏi/ngã)", stage: 4, category: "spelling" },
  32: { title: "Đọc hiểu văn bản thông tin & Văn bản nhật dụng", stage: 4, category: "reading" },
  33: { title: "Tổng ôn tập Từ loại & Các kiểu câu trong tiếng Việt", stage: 4, category: "grammar" },
  34: { title: "Tổng ôn tập Biện pháp nghệ thuật & Cảm thụ văn học", stage: 4, category: "rhetoric" },
  35: { title: "Đề thi thử Học kỳ 2 Tiếng Việt Lớp 4 toàn diện", stage: 4, category: "reading" }
};

// Combine all 350+ Vietnamese questions across 4 stages
export const QUESTION_BANK_TV = [
  ...STAGE_1_TV_QUESTIONS,
  ...STAGE_2_TV_QUESTIONS,
  ...STAGE_3_TV_QUESTIONS,
  ...STAGE_4_TV_QUESTIONS
];

// Helper to get Vietnamese questions for a specific week
export const getQuestionsByWeekTV = (week) => {
  return QUESTION_BANK_TV.filter(q => q.week === Number(week));
};

// Helper to get filtered Vietnamese questions
export const getFilteredQuestionsTV = ({ week, semester, stage, difficulty, category, count = 10 }) => {
  let list = [...QUESTION_BANK_TV];
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
