// NGÂN HÀNG CÂU HỎI NGỮ VĂN LỚP 7 - CHUẨN CHƯƠNG TRÌNH GDPT 2018 (35 TUẦN HỌC - 350+ BÀI TẬP)
import { STAGE_1_LIT7_QUESTIONS } from './stages/stage1_lit7';
import { STAGE_2_LIT7_QUESTIONS } from './stages/stage2_lit7';
import { STAGE_3_LIT7_QUESTIONS } from './stages/stage3_lit7';
import { STAGE_4_LIT7_QUESTIONS } from './stages/stage4_lit7';

export const STAGES_LIT7 = [
  {
    id: 1,
    title: "Chặng 1: Thơ 4 Chữ 5 Chữ & Bầu Trời Tuổi Thơ",
    subtitle: "Tuần 1 - Tuần 9",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    semester: 1,
    icon: "BookOpen",
    color: "from-rose-500 to-pink-600",
    badge: "Nhà Thơ Nhí Tài Năng",
    description: "Thơ 4 chữ 5 chữ, từ ngữ địa phương, biệt ngữ xã hội, truyện ngắn hiện đại, số từ, phó từ và văn bản thông tin."
  },
  {
    id: 2,
    title: "Chặng 2: Khúc Ca Quê Hương, Tùy Bút & Ôn Thi HK1",
    subtitle: "Tuần 10 - Tuần 18 (Ôn thi HK1)",
    weeks: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    semester: 1,
    icon: "Feather",
    color: "from-amber-500 to-orange-600",
    badge: "Cây Bút Trữ Tình Xuất Sắc",
    description: "Tùy bút, tản văn, từ Hán Việt, nghị luận văn học, điệp ngữ, thơ lục bát, câu đặc biệt và Đề thi tổng hợp HK1."
  },
  {
    id: 3,
    title: "Chặng 3: Bài Học Cuộc Sống & Tục Ngữ Dân Gian",
    subtitle: "Tuần 19 - Tuần 27",
    weeks: [19, 20, 21, 22, 23, 24, 25, 26, 27],
    semester: 2,
    icon: "Sparkles",
    color: "from-emerald-500 to-teal-700",
    badge: "Bậc Thầy Ngụ Ngôn & Tục Ngữ",
    description: "Tục ngữ thiên nhiên & lao động, truyện ngụ ngôn đạo lý, thành ngữ, nói quá, thơ trữ tình và liên kết câu đoạn văn."
  },
  {
    id: 4,
    title: "Chặng 4: Nghệ Thuật Sân Khấu, Tu Từ & Tổng Ôn HK2",
    subtitle: "Tuần 28 - Tuần 35 (Ôn thi HK2)",
    weeks: [28, 29, 30, 31, 32, 33, 34, 35],
    semester: 2,
    icon: "Trophy",
    color: "from-indigo-600 to-purple-700",
    badge: "Thần Đồng Ngữ Văn Lớp 7",
    description: "Kịch chèo tuồng dân gian, nói giảm nói tránh, chơi chữ, nghị luận yêu nước, đại từ và Đề thi toàn diện HK2."
  }
];

export const TOPIC_CATEGORIES_LIT7 = [
  { id: "reading_poetry", name: "Đọc hiểu Thơ & Cảm thụ trữ tình", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "reading_prose", name: "Đọc hiểu Truyện & Tùy bút tản văn", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "grammar_language", name: "Thực hành Tiếng Việt & Từ loại", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "argumentative_texts", name: "Văn bản Nghị luận & Đời sống", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "informational_texts", name: "Văn bản Thông tin & Kỹ năng số", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  { id: "idioms_proverbs", name: "Tục ngữ, Thành ngữ & Trí tuệ dân gian", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "fables_stories", name: "Truyện ngụ ngôn & Triết lý nhân sinh", color: "bg-teal-100 text-teal-800 border-teal-300" },
  { id: "drama_theatre", name: "Sân khấu Kịch, Chèo & Tuồng", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "rhetorical_devices", name: "Biện pháp tu từ & Chơi chữ", color: "bg-pink-100 text-pink-800 border-pink-300" },
  { id: "writing_skills", name: "Tập làm văn & Kỹ năng tạo lập văn bản", color: "bg-indigo-100 text-indigo-800 border-indigo-300" }
];

export const WEEKS_METADATA_LIT7 = {
  1: { title: "Thơ bốn chữ, thơ năm chữ (Hình ảnh, vần, nhịp, cảm xúc)", stage: 1, category: "reading_poetry" },
  2: { title: "Thực hành Tiếng Việt: Từ ngữ địa phương & Biệt ngữ xã hội", stage: 1, category: "grammar_language" },
  3: { title: "Truyện ngắn hiện đại: Bầy chim chìa vôi, Đi lấy mật, Người thầy đầu tiên", stage: 1, category: "reading_prose" },
  4: { title: "Thực hành Tiếng Việt: Số từ, phó từ và lượng từ trong câu", stage: 1, category: "grammar_language" },
  5: { title: "Văn bản nghị luận: Ý kiến, lý lẽ và bằng chứng xác thực", stage: 1, category: "argumentative_texts" },
  6: { title: "Thực hành Tiếng Việt: Thuật ngữ khoa học & Nghĩa của từ", stage: 1, category: "grammar_language" },
  7: { title: "Đọc hiểu văn bản thông tin (Văn bản nhật dụng, cước chú)", stage: 1, category: "informational_texts" },
  8: { title: "Thực hành Tiếng Việt: Mở rộng thành phần chính của câu bằng cụm từ", stage: 1, category: "grammar_language" },
  9: { title: "Ôn tập giữa Học kỳ 1 & Kỹ năng cảm thụ thơ văn", stage: 1, category: "reading_poetry" },
  10: { title: "Tùy bút và tản văn: Cốm Làng Vòng, Trùng Khánh nghe hạt dẻ hát", stage: 2, category: "reading_prose" },
  11: { title: "Thực hành Tiếng Việt: Từ Hán Việt & Sắc thái biểu cảm trang trọng", stage: 2, category: "grammar_language" },
  12: { title: "Đọc hiểu văn bản nghị luận văn học & Phân tích tác phẩm", stage: 2, category: "argumentative_texts" },
  13: { title: "Thực hành Tiếng Việt: Biện pháp tu từ Điệp ngữ và tác dụng gợi cảm", stage: 2, category: "rhetorical_devices" },
  14: { title: "Thơ trữ tình hiện đại & Vẻ đẹp thể thơ lục bát biến thể", stage: 2, category: "reading_poetry" },
  15: { title: "Thực hành Tiếng Việt: Câu đặc biệt & Câu rút gọn trong giao tiếp", stage: 2, category: "grammar_language" },
  16: { title: "Tập làm văn: Viết bài văn biểu cảm về con người hoặc sự việc", stage: 2, category: "writing_skills" },
  17: { title: "Kỹ năng đọc hiểu tổng hợp văn bản văn xuôi ngoài sách giáo khoa", stage: 2, category: "reading_prose" },
  18: { title: "Đề thi thử Học kỳ 1 Ngữ văn Lớp 7 toàn diện", stage: 2, category: "reading_poetry" },
  19: { title: "Tục ngữ về thiên nhiên và lao động sản xuất (Gieo vần, vế đối)", stage: 3, category: "idioms_proverbs" },
  20: { title: "Truyện ngụ ngôn: Ếch ngồi đáy giếng, Thầy bói xem voi, Đẽo cày giữa đường", stage: 3, category: "fables_stories" },
  21: { title: "Thực hành Tiếng Việt: Phân biệt Thành ngữ và Tục ngữ Việt Nam", stage: 3, category: "idioms_proverbs" },
  22: { title: "Thực hành Tiếng Việt: Biện pháp tu từ Nói quá và ứng dụng", stage: 3, category: "rhetorical_devices" },
  23: { title: "Thơ trữ tình: Tiếng gà trưa (Xuân Quỳnh) và tình bà cháu thiêng liêng", stage: 3, category: "reading_poetry" },
  24: { title: "Thực hành Tiếng Việt: Công dụng của Dấu chấm lửng & Dấu gạch ngang", stage: 3, category: "grammar_language" },
  25: { title: "Đọc hiểu văn bản nghị luận xã hội về tinh thần tự học và ý chí", stage: 3, category: "argumentative_texts" },
  26: { title: "Thực hành Tiếng Việt: Liên kết câu và liên kết đoạn văn (Phép lặp, thế, nối)", stage: 3, category: "grammar_language" },
  27: { title: "Ôn tập giữa Học kỳ 2 & Kỹ năng viết bài văn nghị luận", stage: 3, category: "argumentative_texts" },
  28: { title: "Sân khấu kịch truyền thống: Thị Mầu lên chùa, Nghêu Sò Ốc Hến", stage: 4, category: "drama_theatre" },
  29: { title: "Thực hành Tiếng Việt: Biện pháp tu từ Nói giảm nói tránh & Chơi chữ", stage: 4, category: "rhetorical_devices" },
  30: { title: "Văn bản nghị luận: Tinh thần yêu nước của nhân dân ta (Hồ Chí Minh)", stage: 4, category: "argumentative_texts" },
  31: { title: "Thực hành Tiếng Việt: Đại từ và Quan hệ từ trong liên kết câu", stage: 4, category: "grammar_language" },
  32: { title: "Đọc hiểu văn bản thông tin: Tóm tắt văn bản bằng sơ đồ tư duy", stage: 4, category: "informational_texts" },
  33: { title: "Tổng ôn tập Tiếng Việt: Từ loại, kiểu câu và biện pháp tu từ", stage: 4, category: "grammar_language" },
  34: { title: "Tổng ôn tập Đọc hiểu văn bản văn học & Cảm thụ nghệ thuật", stage: 4, category: "reading_poetry" },
  35: { title: "Đề thi thử Học kỳ 2 Ngữ văn Lớp 7 toàn diện", stage: 4, category: "reading_poetry" }
};

export const QUESTION_BANK_LIT7 = [
  ...STAGE_1_LIT7_QUESTIONS,
  ...STAGE_2_LIT7_QUESTIONS,
  ...STAGE_3_LIT7_QUESTIONS,
  ...STAGE_4_LIT7_QUESTIONS
];

export const getQuestionsByWeekLit7 = (week) => {
  return QUESTION_BANK_LIT7.filter(q => q.week === Number(week));
};

export const getFilteredQuestionsLit7 = ({ week, semester, stage, difficulty, category, count = 10 }) => {
  let list = [...QUESTION_BANK_LIT7];
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

  const shuffled = list.sort(() => 0.5 - Math.random());
  return count ? shuffled.slice(0, count) : shuffled;
};
