// NGÂN HÀNG CÂU HỎI TOÁN LỚP 3 - KẾT NỐI TRI THỨC
// 35 TUẦN HỌC - 4 CHẶNG PHIÊU LƯU 

import { STAGE_1_QUESTIONS } from './stages/stage1';
import { STAGE_2_QUESTIONS } from './stages/stage2';
import { STAGE_3_QUESTIONS } from './stages/stage3';
import { STAGE_4_QUESTIONS } from './stages/stage4';

export const STAGES = [
  {
    id: 1,
    title: "Chặng 1: Ôn tập & Bảng Nhân Chia",
    subtitle: "Tuần 1 - Tuần 9",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    semester: 1,
    icon: "Rocket",
    color: "from-amber-400 to-orange-500",
    badge: "Vệ binh Nhân Chia",
    description: "Ôn tập các số đến 1000, phép cộng trừ, thành phần chưa biết, và bảng nhân chia từ 2 đến 9."
  },
  {
    id: 2,
    title: "Chặng 2: Hình học cơ bản & Số đến 10.000",
    subtitle: "Tuần 10 - Tuần 18 (Ôn thi HK1)",
    weeks: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    semester: 1,
    icon: "Target",
    color: "from-emerald-400 to-teal-600",
    badge: "Thám tử Hình học",
    description: "Góc, khối hộp, đo lường độ dài, khối lượng, dung tích và các số trong phạm vi 10.000."
  },
  {
    id: 3,
    title: "Chặng 3: Tính toán phạm vi 10.000",
    subtitle: "Tuần 19 - Tuần 27",
    weeks: [19, 20, 21, 22, 23, 24, 25, 26, 27],
    semester: 2,
    icon: "Globe",
    color: "from-blue-400 to-indigo-600",
    badge: "Kị sĩ 10.000",
    description: "Cộng, trừ, nhân, chia số có 4 chữ số, xem đồng hồ, tháng năm và chu vi tam giác, tứ giác."
  },
  {
    id: 4,
    title: "Chặng 4: Các số đến 100.000",
    subtitle: "Tuần 28 - Tuần 35 (Ôn thi HK2)",
    weeks: [28, 29, 30, 31, 32, 33, 34, 35],
    semester: 2,
    icon: "Crown",
    color: "from-purple-500 to-pink-600",
    badge: "Quán quân Toán 3",
    description: "Tính toán trong phạm vi 100.000, tiền Việt Nam, diện tích và thu thập số liệu."
  }
];

export const TOPIC_CATEGORIES = {
  SO_HOC: { id: 'SO_HOC', name: 'Số học', color: 'bg-blue-100 text-blue-800' },
  PHEP_TINH: { id: 'PHEP_TINH', name: 'Phép tính', color: 'bg-green-100 text-green-800' },
  HINH_HOC: { id: 'HINH_HOC', name: 'Hình học & Đo lường', color: 'bg-purple-100 text-purple-800' },
  GIAI_TOAN: { id: 'GIAI_TOAN', name: 'Giải toán có lời văn', color: 'bg-amber-100 text-amber-800' }
};

export const WEEKS_METADATA = {
  1: { title: "Ôn tập các số đến 1000 & Phép cộng trừ", topics: ["SO_HOC", "PHEP_TINH"] },
  2: { title: "Tìm thành phần chưa biết của phép tính", topics: ["PHEP_TINH", "GIAI_TOAN"] },
  3: { title: "Ôn tập bảng nhân chia 2, 5; Bảng 3", topics: ["PHEP_TINH"] },
  4: { title: "Bảng nhân 4, chia 4", topics: ["PHEP_TINH", "GIAI_TOAN"] },
  5: { title: "Gấp giảm một số lần", topics: ["GIAI_TOAN", "PHEP_TINH"] },
  6: { title: "Bảng nhân 6, chia 6", topics: ["PHEP_TINH"] },
  7: { title: "Bảng nhân 7, chia 7", topics: ["PHEP_TINH"] },
  8: { title: "Bảng nhân 8, 9, chia 8, 9", topics: ["PHEP_TINH"] },
  9: { title: "Ôn tập Giữa HK1", topics: ["SO_HOC", "PHEP_TINH", "GIAI_TOAN"] },
  10: { title: "Góc vuông, góc không vuông", topics: ["HINH_HOC"] },
  11: { title: "Khối lập phương, khối hộp chữ nhật", topics: ["HINH_HOC"] },
  12: { title: "Gam, Mi-li-lít, Nhiệt độ", topics: ["HINH_HOC"] },
  13: { title: "Phép chia hết, phép chia có dư", topics: ["PHEP_TINH"] },
  14: { title: "Nhân số 2 chữ số với 1 chữ số", topics: ["PHEP_TINH", "GIAI_TOAN"] },
  15: { title: "Chia số 2 chữ số cho 1 chữ số", topics: ["PHEP_TINH", "GIAI_TOAN"] },
  16: { title: "Các số có 4 chữ số, 10.000", topics: ["SO_HOC"] },
  17: { title: "So sánh số trong phạm vi 10.000", topics: ["SO_HOC"] },
  18: { title: "Ôn tập Cuối HK1", topics: ["SO_HOC", "PHEP_TINH", "HINH_HOC", "GIAI_TOAN"] },
  19: { title: "Phép cộng phạm vi 10.000", topics: ["PHEP_TINH"] },
  20: { title: "Phép trừ phạm vi 10.000", topics: ["PHEP_TINH"] },
  21: { title: "Tháng Năm, Đồng hồ", topics: ["HINH_HOC"] },
  22: { title: "Nhân số 4 chữ số với 1 chữ số", topics: ["PHEP_TINH"] },
  23: { title: "Chia số 4 chữ số cho 1 chữ số", topics: ["PHEP_TINH"] },
  24: { title: "Làm quen chữ số La Mã", topics: ["SO_HOC"] },
  25: { title: "Chu vi hình tam giác, tứ giác", topics: ["HINH_HOC"] },
  26: { title: "Chu vi hình chữ nhật, hình vuông", topics: ["HINH_HOC", "GIAI_TOAN"] },
  27: { title: "Ôn tập Giữa HK2", topics: ["SO_HOC", "PHEP_TINH", "HINH_HOC"] },
  28: { title: "Các số có 5 chữ số, 100.000", topics: ["SO_HOC"] },
  29: { title: "So sánh số phạm vi 100.000", topics: ["SO_HOC"] },
  30: { title: "Phép cộng trừ phạm vi 100.000", topics: ["PHEP_TINH"] },
  31: { title: "Tiền Việt Nam", topics: ["SO_HOC", "GIAI_TOAN"] },
  32: { title: "Nhân số 5 chữ số với 1 chữ số", topics: ["PHEP_TINH"] },
  33: { title: "Chia số 5 chữ số cho 1 chữ số", topics: ["PHEP_TINH"] },
  34: { title: "Diện tích và Thu thập số liệu", topics: ["HINH_HOC"] },
  35: { title: "Ôn tập Cuối năm", topics: ["SO_HOC", "PHEP_TINH", "HINH_HOC", "GIAI_TOAN"] }
};

export const QUESTION_BANK = [
  ...STAGE_1_QUESTIONS,
  ...STAGE_2_QUESTIONS,
  ...STAGE_3_QUESTIONS,
  ...STAGE_4_QUESTIONS
];

export const getQuestionsByWeek = (weekNumber) => {
  return QUESTION_BANK.filter(q => q.week === weekNumber);
};

export const getFilteredQuestions = (filters = {}) => {
  let result = [...QUESTION_BANK];
  
  if (filters.week) {
    result = result.filter(q => q.week === filters.week);
  }
  
  if (filters.difficulty) {
    result = result.filter(q => q.difficulty === filters.difficulty);
  }
  
  if (filters.topic) {
    result = result.filter(q => q.topic === filters.topic);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(q => 
      q.question.toLowerCase().includes(searchLower) || 
      q.explanation.toLowerCase().includes(searchLower)
    );
  }
  
  return result;
};
