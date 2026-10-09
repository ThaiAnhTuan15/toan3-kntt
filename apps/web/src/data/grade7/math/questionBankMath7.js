// NGÂN HÀNG CÂU HỎI TOÁN LỚP 7 - CHUẨN CHƯƠNG TRÌNH GDPT 2018 (35 TUẦN HỌC - 350+ BÀI TẬP)
import { STAGE_1_MATH7_QUESTIONS } from './stages/stage1_math7';
import { STAGE_2_MATH7_QUESTIONS } from './stages/stage2_math7';
import { STAGE_3_MATH7_QUESTIONS } from './stages/stage3_math7';
import { STAGE_4_MATH7_QUESTIONS } from './stages/stage4_math7';

export const STAGES_MATH7 = [
  {
    id: 1,
    title: "Chặng 1: Số Hữu Tỉ, Góc & Đường Thẳng Song Song",
    subtitle: "Tuần 1 - Tuần 9",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    semester: 1,
    icon: "Rocket",
    color: "from-blue-500 to-cyan-600",
    badge: "Hiệp Sĩ Số Hữu Tỉ",
    description: "Tập hợp số hữu tỉ Q, 4 phép tính, lũy thừa, dấu ngoặc, số thập phân, góc đặc biệt và tiên đề Ơ-clit."
  },
  {
    id: 2,
    title: "Chặng 2: Số Thực, Tam Giác Bằng Nhau & Thống Kê",
    subtitle: "Tuần 10 - Tuần 18 (Ôn thi HK1)",
    weeks: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    semester: 1,
    icon: "Target",
    color: "from-indigo-500 to-blue-700",
    badge: "Bậc Thầy Hình Học HK1",
    description: "Số vô tỉ, căn bậc hai, số thực R, các trường hợp bằng nhau của tam giác (c-c-c, c-g-c, g-c-g), tam giác cân và biểu đồ."
  },
  {
    id: 3,
    title: "Chặng 3: Tỉ Lệ Thức & Đa Thức Một Biến",
    subtitle: "Tuần 19 - Tuần 27",
    weeks: [19, 20, 21, 22, 23, 24, 25, 26, 27],
    semester: 2,
    icon: "Sparkles",
    color: "from-amber-500 to-orange-600",
    badge: "Chuyên Gia Đại Số 7",
    description: "Tỉ lệ thức, dãy tỉ số bằng nhau, đại lượng tỉ lệ thuận - nghịch, biểu thức đại số, cộng trừ nhân chia và nghiệm đa thức 1 biến."
  },
  {
    id: 4,
    title: "Chặng 4: Quan Hệ Tam Giác, Hình Khối & Xác Suất",
    subtitle: "Tuần 28 - Tuần 35 (Ôn thi HK2)",
    weeks: [28, 29, 30, 31, 32, 33, 34, 35],
    semester: 2,
    icon: "Trophy",
    color: "from-emerald-500 to-teal-700",
    badge: "Thần Đồng Toán Học Lớp 7",
    description: "Bất đẳng thức tam giác, các đường đồng quy (trọng tâm, trực tâm), hình lăng trụ đứng, hình lập phương và xác suất biến cố."
  }
];

export const TOPIC_CATEGORIES_MATH7 = [
  { id: "rational_numbers", name: "Số hữu tỉ & Lũy thừa", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "real_numbers", name: "Số thực, Căn bậc hai & Làm tròn", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  { id: "geometry_basics", name: "Góc & Đường thẳng song song", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { id: "triangle_congruence", name: "Tam giác bằng nhau & Tam giác cân", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "algebraic_expressions", name: "Tỉ lệ thức & Đa thức 1 biến", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "geometry_triangles", name: "Quan hệ tam giác & Các đường đồng quy", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "spatial_geometry", name: "Hình khối không gian & Đo lường", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "statistics_probability", name: "Thống kê dữ liệu & Xác suất", color: "bg-teal-100 text-teal-800 border-teal-300" }
];

export const WEEKS_METADATA_MATH7 = {
  1: { title: "Tập hợp các số hữu tỉ Q & Biểu diễn trên trục số", stage: 1, category: "rational_numbers" },
  2: { title: "Cộng, trừ, nhân, chia số hữu tỉ", stage: 1, category: "rational_numbers" },
  3: { title: "Lũy thừa với số mũ tự nhiên của một số hữu tỉ", stage: 1, category: "rational_numbers" },
  4: { title: "Quy tắc dấu ngoặc và thứ tự thực hiện các phép tính", stage: 1, category: "rational_numbers" },
  5: { title: "Biểu diễn thập phân của số hữu tỉ & Làm tròn số", stage: 1, category: "rational_numbers" },
  6: { title: "Các góc ở vị trí đặc biệt (Kề bù, Đối đỉnh, Phân giác)", stage: 1, category: "geometry_basics" },
  7: { title: "Hai đường thẳng song song & Tiên đề Ơ-clit", stage: 1, category: "geometry_basics" },
  8: { title: "Định lí và chứng minh một định lí hình học", stage: 1, category: "geometry_basics" },
  9: { title: "Ôn tập giữa Học kỳ 1 & Toán tư duy nâng cao", stage: 1, category: "rational_numbers" },
  10: { title: "Số vô tỉ & Căn bậc hai số học", stage: 2, category: "real_numbers" },
  11: { title: "Tập hợp số thực R & Giá trị tuyệt đối của số thực", stage: 2, category: "real_numbers" },
  12: { title: "Làm tròn số và ước lượng kết quả thực tiễn", stage: 2, category: "real_numbers" },
  13: { title: "Hai tam giác bằng nhau & Trường hợp c-c-c", stage: 2, category: "triangle_congruence" },
  14: { title: "Trường hợp bằng nhau Cạnh - Góc - Cạnh (c-g-c)", stage: 2, category: "triangle_congruence" },
  15: { title: "Trường hợp bằng nhau Góc - Cạnh - Góc (g-c-g)", stage: 2, category: "triangle_congruence" },
  16: { title: "Tam giác cân, tam giác đều & Đường trung trực", stage: 2, category: "triangle_congruence" },
  17: { title: "Thu thập, phân loại và biểu diễn dữ liệu (Biểu đồ quạt, đoạn thẳng)", stage: 2, category: "statistics_probability" },
  18: { title: "Đề thi thử Học kỳ 1 Toán Lớp 7 toàn diện", stage: 2, category: "rational_numbers" },
  19: { title: "Tỉ lệ thức và các tính chất cơ bản", stage: 3, category: "algebraic_expressions" },
  20: { title: "Tính chất của dãy tỉ số bằng nhau & Bài toán thực tế", stage: 3, category: "algebraic_expressions" },
  21: { title: "Đại lượng tỉ lệ thuận & Ứng dụng giải toán", stage: 3, category: "algebraic_expressions" },
  22: { title: "Đại lượng tỉ lệ nghịch & Ứng dụng phân chia công việc", stage: 3, category: "algebraic_expressions" },
  23: { title: "Biểu thức đại số & Giá trị của biểu thức đại số", stage: 3, category: "algebraic_expressions" },
  24: { title: "Đơn thức một biến & Đa thức một biến (Bậc, hệ số)", stage: 3, category: "algebraic_expressions" },
  25: { title: "Phép cộng và phép trừ đa thức một biến", stage: 3, category: "algebraic_expressions" },
  26: { title: "Phép nhân và phép chia đa thức một biến", stage: 3, category: "algebraic_expressions" },
  27: { title: "Nghiệm của đa thức một biến & Ôn tập giữa HK2", stage: 3, category: "algebraic_expressions" },
  28: { title: "Quan hệ góc - cạnh đối diện, Đường vuông góc & Đường xiên", stage: 4, category: "geometry_triangles" },
  29: { title: "Bất đẳng thức tam giác và điều kiện tồn tại tam giác", stage: 4, category: "geometry_triangles" },
  30: { title: "Sự đồng quy của ba đường trung tuyến (Trọng tâm G)", stage: 4, category: "geometry_triangles" },
  31: { title: "Sự đồng quy của ba đường phân giác, trung trực, đường cao", stage: 4, category: "geometry_triangles" },
  32: { title: "Hình khối thực tiễn: Hình hộp chữ nhật & Hình lập phương", stage: 4, category: "spatial_geometry" },
  33: { title: "Hình lăng trụ đứng tam giác và tứ giác (Diện tích, thể tích)", stage: 4, category: "spatial_geometry" },
  34: { title: "Xác suất của biến cố ngẫu nhiên trong trò chơi đơn giản", stage: 4, category: "statistics_probability" },
  35: { title: "Đề thi thử Học kỳ 2 Toán Lớp 7 toàn diện", stage: 4, category: "algebraic_expressions" }
};

export const QUESTION_BANK_MATH7 = [
  ...STAGE_1_MATH7_QUESTIONS,
  ...STAGE_2_MATH7_QUESTIONS,
  ...STAGE_3_MATH7_QUESTIONS,
  ...STAGE_4_MATH7_QUESTIONS
];

export const getQuestionsByWeekMath7 = (week) => {
  return QUESTION_BANK_MATH7.filter(q => q.week === Number(week));
};

export const getFilteredQuestionsMath7 = ({ week, semester, stage, difficulty, category, count = 10 }) => {
  let list = [...QUESTION_BANK_MATH7];
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
