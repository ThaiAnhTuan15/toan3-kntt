// NGÂN HÀNG CÂU HỎI TOÁN LỚP 3 - BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
// TOÀN BỘ HỌC KỲ 1: 6 CHẶNG - 66 ĐỀ - 934 CÂU HỎI CHUẨN ĐÃ GIẢI CHI TIẾT

import { STAGE_1_QUESTIONS } from './stages/stage1';
import { STAGE_2_QUESTIONS } from './stages/stage2';
import { STAGE_3_QUESTIONS } from './stages/stage3';
import { STAGE_4_QUESTIONS } from './stages/stage4';
import { STAGE_5_QUESTIONS } from './stages/stage5';
import { STAGE_6_QUESTIONS } from './stages/stage6';

export const STAGES = [
  {
    id: 1,
    title: "Chặng 1: Vương quốc Số học & Phép tính cơ bản",
    subtitle: "Đề 1 đến Đề 13 (Bài 1 - 8)",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    semester: 1,
    icon: "Rocket",
    color: "from-amber-400 to-orange-500",
    badge: "Vệ binh Số học",
    description: "Ôn tập các số đến 1 000, phép cộng trừ có nhớ, tìm thành phần phép tính và cửu chương 3."
  },
  {
    id: 2,
    title: "Chặng 2: Khu rừng Bảng Cửu chương & Một phần mấy",
    subtitle: "Đề 14 đến Đề 23 (Bài 6, 9 - 15)",
    weeks: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    semester: 1,
    icon: "Sparkles",
    color: "from-emerald-400 to-teal-600",
    badge: "Bậc thầy Cửu chương",
    description: "Thành thạo bảng nhân chia từ 4 đến 9, tìm x nhân chia và làm quen Một phần mấy (1/2 đến 1/9)."
  },
  {
    id: 3,
    title: "Chặng 3: Xứ sở Hình học & Không gian kỳ thú",
    subtitle: "Đề 24 đến Đề 36 (Bài 16 - 22)",
    weeks: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    semester: 1,
    icon: "Target",
    color: "from-blue-400 to-indigo-600",
    badge: "Kiến trúc sư nhí",
    description: "Trung điểm đoạn thẳng, hình tròn, góc vuông ê-ke, hình chữ nhật, khối lập phương và khối hộp."
  },
  {
    id: 4,
    title: "Chặng 4: Đấu trường Phép tính & Toán 2 bước tính",
    subtitle: "Đề 37 đến Đề 48 (Bài 24 - 29)",
    weeks: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
    semester: 1,
    icon: "Flame",
    color: "from-rose-400 to-red-600",
    badge: "Hiệp sĩ 2 Bước",
    description: "Gấp giảm số lần, phép chia có dư, chia 2 chữ số cho 1 chữ số và bài toán giải bằng 2 bước tính."
  },
  {
    id: 5,
    title: "Chặng 5: Thung lũng Đo lường & Nhà thám hiểm",
    subtitle: "Đề 49 đến Đề 57 (Bài 30 - 35)",
    weeks: [49, 50, 51, 52, 53, 54, 55, 56, 57],
    semester: 1,
    icon: "BookOpen",
    color: "from-cyan-400 to-blue-600",
    badge: "Nhà Thám Hiểm Đo Lường",
    description: "Thực hành cân đo đong đếm cùng Mi-li-mét (mm), Gam (g), Mi-li-lít (ml) và Nhiệt độ (°C)."
  },
  {
    id: 6,
    title: "Chặng 6: Đỉnh núi Trí tuệ & Tổng ôn Học kỳ 1",
    subtitle: "Đề 58 đến Đề 66 (Bài 36 - 44)",
    weeks: [58, 59, 60, 61, 62, 63, 64, 65, 66],
    semester: 1,
    icon: "Trophy",
    color: "from-purple-500 to-pink-600",
    badge: "Quán quân Toán 3 HK1",
    description: "Nhân chia số có 3 chữ số, tính giá trị biểu thức số và đại ôn tập tổng lực thi Học kỳ 1."
  }
];

export const TOPIC_CATEGORIES = [
  { id: "SO_HOC", name: "Số học & Cấu tạo số", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "PHEP_TINH", name: "Phép tính cộng, trừ, nhân, chia", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "HINH_HOC", name: "Hình học & Không gian", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "GIAI_TOAN", name: "Giải toán có lời văn", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "DO_LUONG", name: "Đại lượng & Đo lường", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "PHAN_SO", name: "Một phần mấy & Phân số", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "natural_num", name: "Số học & Cấu tạo số", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "operations", name: "Phép tính cộng, trừ, nhân, chia", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "geometry", name: "Hình học & Không gian", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "measurement", name: "Đại lượng & Đo lường", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "word_problems", name: "Giải toán có lời văn", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "fractions", name: "Một phần mấy & Phân số", color: "bg-rose-100 text-rose-800 border-rose-300" }
];

TOPIC_CATEGORIES.SO_HOC = TOPIC_CATEGORIES[0];
TOPIC_CATEGORIES.PHEP_TINH = TOPIC_CATEGORIES[1];
TOPIC_CATEGORIES.HINH_HOC = TOPIC_CATEGORIES[2];
TOPIC_CATEGORIES.GIAI_TOAN = TOPIC_CATEGORIES[3];
TOPIC_CATEGORIES.DO_LUONG = TOPIC_CATEGORIES[4];
TOPIC_CATEGORIES.PHAN_SO = TOPIC_CATEGORIES[5];
TOPIC_CATEGORIES.natural_num = TOPIC_CATEGORIES[0];
TOPIC_CATEGORIES.operations = TOPIC_CATEGORIES[1];
TOPIC_CATEGORIES.geometry = TOPIC_CATEGORIES[2];
TOPIC_CATEGORIES.measurement = TOPIC_CATEGORIES[4];
TOPIC_CATEGORIES.word_problems = TOPIC_CATEGORIES[3];
TOPIC_CATEGORIES.fractions = TOPIC_CATEGORIES[5];

export const WEEKS_METADATA = {
  "1": {
    "id": 1,
    "title": "Đọc, viết và cấu tạo số đến 1 000 (Cơ bản)",
    "full_name": "Đề 1: Đọc, viết và cấu tạo số đến 1 000 (Cơ bản)",
    "stage": 1,
    "lesson_origin": "Bài 1: Ôn tập các số đến 1 000",
    "total_questions": 12,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 5,
      "medium": 5,
      "hard": 2,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "2": {
    "id": 2,
    "title": "So sánh và thứ tự các số đến 1 000 (Luyện tập)",
    "full_name": "Đề 2: So sánh và thứ tự các số đến 1 000 (Luyện tập)",
    "stage": 1,
    "lesson_origin": "Bài 1: Ôn tập các số đến 1 000",
    "total_questions": 12,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 5,
      "medium": 4,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "3": {
    "id": 3,
    "title": "Dãy số quy luật & Thử thách số lớn nhất, bé nhất (Nâng cao)",
    "full_name": "Đề 3: Dãy số quy luật & Thử thách số lớn nhất, bé nhất (Nâng cao)",
    "stage": 1,
    "lesson_origin": "Bài 1: Ôn tập các số đến 1 000",
    "total_questions": 12,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 5,
      "medium": 4,
      "hard": 1,
      "expert": 2
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "4": {
    "id": 4,
    "title": "Phép cộng, phép trừ trong PV 1000 - Đề A (Cơ bản & Đặt tính)",
    "full_name": "Đề 4: Phép cộng, phép trừ trong PV 1000 - Đề A (Cơ bản & Đặt tính)",
    "stage": 1,
    "lesson_origin": "Bài 2: BÀI 2: ÔN TẬP PHÉP CỘNG, PHÉP TRỪ TRONG PHẠM VI 1000",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 4,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "5": {
    "id": 5,
    "title": "Phép cộng, phép trừ trong PV 1000 - Đề B (Luyện tập & Toán đố)",
    "full_name": "Đề 5: Phép cộng, phép trừ trong PV 1000 - Đề B (Luyện tập & Toán đố)",
    "stage": 1,
    "lesson_origin": "Bài 2: BÀI 2: ÔN TẬP PHÉP CỘNG, PHÉP TRỪ TRONG PHẠM VI 1000",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 5,
      "hard": 3,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "6": {
    "id": 6,
    "title": "Tìm thành phần phép cộng, trừ - Đề A (Quy tắc & Tìm x cơ bản)",
    "full_name": "Đề 6: Tìm thành phần phép cộng, trừ - Đề A (Quy tắc & Tìm x cơ bản)",
    "stage": 1,
    "lesson_origin": "Bài 3: BÀI 3 - TÌM THÀNH PHẦN TRONG PHÉP CỘNG, PHÉP TRỪ",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 4,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "7": {
    "id": 7,
    "title": "Tìm thành phần phép cộng, trừ - Đề B (Tìm x nâng cao & Toán thực tế)",
    "full_name": "Đề 7: Tìm thành phần phép cộng, trừ - Đề B (Tìm x nâng cao & Toán thực tế)",
    "stage": 1,
    "lesson_origin": "Bài 3: BÀI 3 - TÌM THÀNH PHẦN TRONG PHÉP CỘNG, PHÉP TRỪ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 5,
      "hard": 3,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "8": {
    "id": 8,
    "title": "Bảng nhân 3, bảng chia 3 - Đề A (Học thuộc cửu chương & Tính nhẩm)",
    "full_name": "Đề 8: Bảng nhân 3, bảng chia 3 - Đề A (Học thuộc cửu chương & Tính nhẩm)",
    "stage": 1,
    "lesson_origin": "Bài 5: BÀI 5 - BẢNG NHÂN 3, BẢNG CHIA 3",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 8,
      "medium": 4,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "9": {
    "id": 9,
    "title": "Bảng nhân 3, bảng chia 3 - Đề B (Chia kẹo, chia nhóm & Toán đố)",
    "full_name": "Đề 9: Bảng nhân 3, bảng chia 3 - Đề B (Chia kẹo, chia nhóm & Toán đố)",
    "stage": 1,
    "lesson_origin": "Bài 5: BÀI 5 - BẢNG NHÂN 3, BẢNG CHIA 3",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 3,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "10": {
    "id": 10,
    "title": "Ôn tập Hình học và Đo lường - Đề A (Điểm, đoạn thẳng & Độ dài dm/cm)",
    "full_name": "Đề 10: Ôn tập Hình học và Đo lường - Đề A (Điểm, đoạn thẳng & Độ dài dm/cm)",
    "stage": 1,
    "lesson_origin": "Bài 7: BÀI 7: ÔN TẬP HÌNH HỌC VÀ ĐO LƯỜNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "11": {
    "id": 11,
    "title": "Ôn tập Hình học và Đo lường - Đề B (Đếm hình & Tính chu vi cơ bản)",
    "full_name": "Đề 11: Ôn tập Hình học và Đo lường - Đề B (Đếm hình & Tính chu vi cơ bản)",
    "stage": 1,
    "lesson_origin": "Bài 7: BÀI 7: ÔN TẬP HÌNH HỌC VÀ ĐO LƯỜNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "12": {
    "id": 12,
    "title": "Luyện tập chung - Đề A (Rèn luyện tổng hợp số học & hình học)",
    "full_name": "Đề 12: Luyện tập chung - Đề A (Rèn luyện tổng hợp số học & hình học)",
    "stage": 1,
    "lesson_origin": "Bài 8: BÀI 8: LUYỆN TẬP CHUNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "13": {
    "id": 13,
    "title": "Luyện tập chung - Đề B (Thử thách tư duy & Vượt Chặng 1)",
    "full_name": "Đề 13: Luyện tập chung - Đề B (Thử thách tư duy & Vượt Chặng 1)",
    "stage": 1,
    "lesson_origin": "Bài 8: BÀI 8: LUYỆN TẬP CHUNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "14": {
    "id": 14,
    "title": "Bảng nhân 4, bảng chia 4 - Đề A (Tính nhẩm & Cửu chương)",
    "full_name": "Đề 14: Bảng nhân 4, bảng chia 4 - Đề A (Tính nhẩm & Cửu chương)",
    "stage": 2,
    "lesson_origin": "Bài 6: BÀI 6: BẢNG NHÂN 4, BẢNG CHIA 4",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 8,
      "medium": 4,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "15": {
    "id": 15,
    "title": "Bảng nhân 4, bảng chia 4 - Đề B (Gấp 4 lần & Toán thực tế)",
    "full_name": "Đề 15: Bảng nhân 4, bảng chia 4 - Đề B (Gấp 4 lần & Toán thực tế)",
    "stage": 2,
    "lesson_origin": "Bài 6: BÀI 6: BẢNG NHÂN 4, BẢNG CHIA 4",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 3,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "16": {
    "id": 16,
    "title": "Bảng nhân 6, bảng chia 6 (Cơ bản & Luyện nhẩm)",
    "full_name": "Đề 16: Bảng nhân 6, bảng chia 6 (Cơ bản & Luyện nhẩm)",
    "stage": 2,
    "lesson_origin": "Bài 9: Bảng nhân 6, bảng chia 6",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 11,
      "medium": 3,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "17": {
    "id": 17,
    "title": "Bảng nhân 6 & 7 liên kết (Cầu nối kiến thức)",
    "full_name": "Đề 17: Bảng nhân 6 & 7 liên kết (Cầu nối kiến thức)",
    "stage": 2,
    "lesson_origin": "Bài 9 & Bài 10 (Chuyển tiếp ôn tập)",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 9,
      "medium": 5,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "18": {
    "id": 18,
    "title": "Bảng nhân 7, bảng chia 7 & Toán đố ngày tuần (Nâng cao)",
    "full_name": "Đề 18: Bảng nhân 7, bảng chia 7 & Toán đố ngày tuần (Nâng cao)",
    "stage": 2,
    "lesson_origin": "Bài 10: Bảng nhân 7, bảng chia 7",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 4,
      "medium": 3,
      "hard": 5,
      "expert": 3
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "19": {
    "id": 19,
    "title": "Bảng nhân 8, bảng chia 8 (Luyện nhẩm & Mở rộng)",
    "full_name": "Đề 19: Bảng nhân 8, bảng chia 8 (Luyện nhẩm & Mở rộng)",
    "stage": 2,
    "lesson_origin": "Bài 11 & mở rộng Bài 12",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 14,
      "medium": 1,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "20": {
    "id": 20,
    "title": "Bảng nhân 9, bảng chia 9 (Thuộc lòng cửu chương 9)",
    "full_name": "Đề 20: Bảng nhân 9, bảng chia 9 (Thuộc lòng cửu chương 9)",
    "stage": 2,
    "lesson_origin": "Bài 12: Bảng nhân 9, bảng chia 9",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 12,
      "medium": 3,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "21": {
    "id": 21,
    "title": "Tìm thành phần phép nhân, phép chia (Tìm x nhân chia)",
    "full_name": "Đề 21: Tìm thành phần phép nhân, phép chia (Tìm x nhân chia)",
    "stage": 2,
    "lesson_origin": "Bài 13: Tìm thành phần trong phép nhân, phép chia",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 13,
      "medium": 1,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "22": {
    "id": 22,
    "title": "Một phần mấy & Ôn tập cửu chương - Đề A",
    "full_name": "Đề 22: Một phần mấy & Ôn tập cửu chương - Đề A",
    "stage": 2,
    "lesson_origin": "Bài 14 & Bài 15 (Một phần mấy & Luyện tập)",
    "total_questions": 11,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 11,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "23": {
    "id": 23,
    "title": "Luyện tập chung cửu chương & Vượt Chặng 2 - Đề B",
    "full_name": "Đề 23: Luyện tập chung cửu chương & Vượt Chặng 2 - Đề B",
    "stage": 2,
    "lesson_origin": "Bài 15: Luyện tập chung",
    "total_questions": 10,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 10,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "24": {
    "id": 24,
    "title": "Điểm ở giữa, trung điểm - Đề A (Nhận biết & Tính độ dài)",
    "full_name": "Đề 24: Điểm ở giữa, trung điểm - Đề A (Nhận biết & Tính độ dài)",
    "stage": 3,
    "lesson_origin": "Bài 16: BÀI 16: ĐIỂM Ở GIỮA, TRUNG ĐIỂM CỦA ĐOẠN THẲNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "25": {
    "id": 25,
    "title": "Điểm ở giữa, trung điểm - Đề B (Toán đố & Ứng dụng)",
    "full_name": "Đề 25: Điểm ở giữa, trung điểm - Đề B (Toán đố & Ứng dụng)",
    "stage": 3,
    "lesson_origin": "Bài 16: BÀI 16: ĐIỂM Ở GIỮA, TRUNG ĐIỂM CỦA ĐOẠN THẲNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "26": {
    "id": 26,
    "title": "Hình tròn, tâm, bán kính, đường kính",
    "full_name": "Đề 26: Hình tròn, tâm, bán kính, đường kính",
    "stage": 3,
    "lesson_origin": "Bài 17: Hình tròn. Tâm, bán kính, đường kính",
    "total_questions": 10,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 10,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "27": {
    "id": 27,
    "title": "Góc, góc vuông, góc không vuông - Đề A (Dùng ê-ke kiểm tra)",
    "full_name": "Đề 27: Góc, góc vuông, góc không vuông - Đề A (Dùng ê-ke kiểm tra)",
    "stage": 3,
    "lesson_origin": "Bài 18: BÀI 18: GÓC, GÓC VUÔNG, GÓC KHÔNG VUÔNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "28": {
    "id": 28,
    "title": "Góc, góc vuông, góc không vuông - Đề B (Đếm góc trong hình)",
    "full_name": "Đề 28: Góc, góc vuông, góc không vuông - Đề B (Đếm góc trong hình)",
    "stage": 3,
    "lesson_origin": "Bài 18: BÀI 18: GÓC, GÓC VUÔNG, GÓC KHÔNG VUÔNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "29": {
    "id": 29,
    "title": "Tam giác, tứ giác, chữ nhật, vuông - Đề A (Nhận diện hình phẳng)",
    "full_name": "Đề 29: Tam giác, tứ giác, chữ nhật, vuông - Đề A (Nhận diện hình phẳng)",
    "stage": 3,
    "lesson_origin": "Bài 19: BÀI 19: HÌNH TAM GIÁC, HÌNH TỨ GIÁC. HÌNH CHỮ NHẬT, HÌNH VUÔNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "30": {
    "id": 30,
    "title": "Tam giác, tứ giác, chữ nhật, vuông - Đề B (Tính chất cạnh & góc)",
    "full_name": "Đề 30: Tam giác, tứ giác, chữ nhật, vuông - Đề B (Tính chất cạnh & góc)",
    "stage": 3,
    "lesson_origin": "Bài 19: BÀI 19: HÌNH TAM GIÁC, HÌNH TỨ GIÁC. HÌNH CHỮ NHẬT, HÌNH VUÔNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "31": {
    "id": 31,
    "title": "Thực hành vẽ góc vuông, đường tròn - Đề A (Kỹ năng vẽ hình)",
    "full_name": "Đề 31: Thực hành vẽ góc vuông, đường tròn - Đề A (Kỹ năng vẽ hình)",
    "stage": 3,
    "lesson_origin": "Bài 20: BÀI 20: THỰC HÀNH VẼ GÓC VUÔNG, VẼ ĐƯỜNG TRÒN, HÌNH VUÔNG, HÌNH CHỮ NHẬT VÀ VẼ TRANG TRÍ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "32": {
    "id": 32,
    "title": "Thực hành vẽ hình trang trí - Đề B (Họa tiết & Sáng tạo)",
    "full_name": "Đề 32: Thực hành vẽ hình trang trí - Đề B (Họa tiết & Sáng tạo)",
    "stage": 3,
    "lesson_origin": "Bài 20: BÀI 20: THỰC HÀNH VẼ GÓC VUÔNG, VẼ ĐƯỜNG TRÒN, HÌNH VUÔNG, HÌNH CHỮ NHẬT VÀ VẼ TRANG TRÍ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "33": {
    "id": 33,
    "title": "Khối lập phương, khối hộp chữ nhật - Đề A (Đỉnh, cạnh, mặt)",
    "full_name": "Đề 33: Khối lập phương, khối hộp chữ nhật - Đề A (Đỉnh, cạnh, mặt)",
    "stage": 3,
    "lesson_origin": "Bài 21: BÀI 21: KHỐI LẬP PHƯƠNG, KHỐI HỘP CHỮ NHẬT",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "34": {
    "id": 34,
    "title": "Khối lập phương, khối hộp chữ nhật - Đề B (Đếm khối hình không gian)",
    "full_name": "Đề 34: Khối lập phương, khối hộp chữ nhật - Đề B (Đếm khối hình không gian)",
    "stage": 3,
    "lesson_origin": "Bài 21: BÀI 21: KHỐI LẬP PHƯƠNG, KHỐI HỘP CHỮ NHẬT",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "35": {
    "id": 35,
    "title": "Luyện tập chung Hình học - Đề A (Tổng ôn phẳng & không gian)",
    "full_name": "Đề 35: Luyện tập chung Hình học - Đề A (Tổng ôn phẳng & không gian)",
    "stage": 3,
    "lesson_origin": "Bài 22: BÀI 22: LUYỆN TẬP CHUNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "36": {
    "id": 36,
    "title": "Luyện tập chung Hình học - Đề B (Thử thách tư duy & Vượt Chặng 3)",
    "full_name": "Đề 36: Luyện tập chung Hình học - Đề B (Thử thách tư duy & Vượt Chặng 3)",
    "stage": 3,
    "lesson_origin": "Bài 22: BÀI 22: LUYỆN TẬP CHUNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "37": {
    "id": 37,
    "title": "Gấp một số lên một số lần - Đề A (Nhận biết quy tắc nhân)",
    "full_name": "Đề 37: Gấp một số lên một số lần - Đề A (Nhận biết quy tắc nhân)",
    "stage": 4,
    "lesson_origin": "Bài 24: BÀI 24: GẤP MỘT SỐ LÊN MỘT SỐ LẦN",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "38": {
    "id": 38,
    "title": "Gấp một số lên một số lần - Đề B (Phân biệt với nhiều hơn & Toán đố)",
    "full_name": "Đề 38: Gấp một số lên một số lần - Đề B (Phân biệt với nhiều hơn & Toán đố)",
    "stage": 4,
    "lesson_origin": "Bài 24: BÀI 24: GẤP MỘT SỐ LÊN MỘT SỐ LẦN",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "39": {
    "id": 39,
    "title": "Phép chia hết, phép chia có dư - Đề A (Tìm thương và số dư)",
    "full_name": "Đề 39: Phép chia hết, phép chia có dư - Đề A (Tìm thương và số dư)",
    "stage": 4,
    "lesson_origin": "Bài 25: BÀI 25: PHÉP CHIA HẾT, PHÉP CHIA CÓ DƯ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "40": {
    "id": 40,
    "title": "Phép chia hết, phép chia có dư - Đề B (Số dư lớn nhất & Toán xếp đồ)",
    "full_name": "Đề 40: Phép chia hết, phép chia có dư - Đề B (Số dư lớn nhất & Toán xếp đồ)",
    "stage": 4,
    "lesson_origin": "Bài 25: BÀI 25: PHÉP CHIA HẾT, PHÉP CHIA CÓ DƯ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "41": {
    "id": 41,
    "title": "Chia số có hai chữ số cho số có một chữ số - Đề A (Đặt tính cơ bản)",
    "full_name": "Đề 41: Chia số có hai chữ số cho số có một chữ số - Đề A (Đặt tính cơ bản)",
    "stage": 4,
    "lesson_origin": "Bài 26: BÀI 26: CHIA SỐ CÓ HAI CHỮ SỐ CHO SỐ CÓ MỘT CHỮ SỐ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "42": {
    "id": 42,
    "title": "Chia số có hai chữ số cho số có một chữ số - Đề B (Chia có dư & Toán thực tế)",
    "full_name": "Đề 42: Chia số có hai chữ số cho số có một chữ số - Đề B (Chia có dư & Toán thực tế)",
    "stage": 4,
    "lesson_origin": "Bài 26: BÀI 26: CHIA SỐ CÓ HAI CHỮ SỐ CHO SỐ CÓ MỘT CHỮ SỐ",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "43": {
    "id": 43,
    "title": "Giảm một số đi một số lần - Đề A (Nhận biết quy tắc chia)",
    "full_name": "Đề 43: Giảm một số đi một số lần - Đề A (Nhận biết quy tắc chia)",
    "stage": 4,
    "lesson_origin": "Bài 27: BÀI 27: GIẢM MỘT SỐ ĐI MỘT SỐ LẦN",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "44": {
    "id": 44,
    "title": "Giảm một số đi một số lần - Đề B (Phân biệt với ít hơn & Toán đố)",
    "full_name": "Đề 44: Giảm một số đi một số lần - Đề B (Phân biệt với ít hơn & Toán đố)",
    "stage": 4,
    "lesson_origin": "Bài 27: BÀI 27: GIẢM MỘT SỐ ĐI MỘT SỐ LẦN",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "45": {
    "id": 45,
    "title": "Bài toán giải bằng hai bước tính - Đề A (Tìm bước 1 & kết nối)",
    "full_name": "Đề 45: Bài toán giải bằng hai bước tính - Đề A (Tìm bước 1 & kết nối)",
    "stage": 4,
    "lesson_origin": "Bài 28: BÀI 28: BÀI TOÁN GIẢI BẰNG HAI BƯỚC TÍNH",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "46": {
    "id": 46,
    "title": "Bài toán giải bằng hai bước tính - Đề B (Toán có lời văn nâng cao)",
    "full_name": "Đề 46: Bài toán giải bằng hai bước tính - Đề B (Toán có lời văn nâng cao)",
    "stage": 4,
    "lesson_origin": "Bài 28: BÀI 28: BÀI TOÁN GIẢI BẰNG HAI BƯỚC TÍNH",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "47": {
    "id": 47,
    "title": "Luyện tập chung - Đề A (Tổng ôn chia & toán 2 bước)",
    "full_name": "Đề 47: Luyện tập chung - Đề A (Tổng ôn chia & toán 2 bước)",
    "stage": 4,
    "lesson_origin": "Bài 29: BÀI 29: LUYỆN TẬP CHUNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "48": {
    "id": 48,
    "title": "Luyện tập chung - Đề B (Thử thách tư duy & Vượt Chặng 4)",
    "full_name": "Đề 48: Luyện tập chung - Đề B (Thử thách tư duy & Vượt Chặng 4)",
    "stage": 4,
    "lesson_origin": "Bài 29: BÀI 29: LUYỆN TẬP CHUNG",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "49": {
    "id": 49,
    "title": "Mi-li-mét - Đề A (Đọc thước kẻ & Đổi cm sang mm)",
    "full_name": "Đề 49: Mi-li-mét - Đề A (Đọc thước kẻ & Đổi cm sang mm)",
    "stage": 5,
    "lesson_origin": "Bài 30: BÀI 30: MI-LI-MÉT",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "50": {
    "id": 50,
    "title": "Mi-li-mét - Đề B (Thực hành đo độ dài đồ vật)",
    "full_name": "Đề 50: Mi-li-mét - Đề B (Thực hành đo độ dài đồ vật)",
    "stage": 5,
    "lesson_origin": "Bài 30: BÀI 30: MI-LI-MÉT",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "51": {
    "id": 51,
    "title": "Gam - Đề A (Đọc cân đồng hồ & Đổi kg sang g)",
    "full_name": "Đề 51: Gam - Đề A (Đọc cân đồng hồ & Đổi kg sang g)",
    "stage": 5,
    "lesson_origin": "Bài 31: BÀI 31: GAM",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "52": {
    "id": 52,
    "title": "Gam - Đề B (Tính toán cân nặng đồ vật thực tế)",
    "full_name": "Đề 52: Gam - Đề B (Tính toán cân nặng đồ vật thực tế)",
    "stage": 5,
    "lesson_origin": "Bài 31: BÀI 31: GAM",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "53": {
    "id": 53,
    "title": "Mi-li-lít - Đề A (Đọc ca đong & Đổi lít sang ml)",
    "full_name": "Đề 53: Mi-li-lít - Đề A (Đọc ca đong & Đổi lít sang ml)",
    "stage": 5,
    "lesson_origin": "Bài 32: BÀI 32: MI-LI-LÍT",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 7,
      "medium": 5,
      "hard": 2,
      "expert": 1
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "54": {
    "id": 54,
    "title": "Mi-li-lít - Đề B (Rót nước & Tính dung tích cốc bình)",
    "full_name": "Đề 54: Mi-li-lít - Đề B (Rót nước & Tính dung tích cốc bình)",
    "stage": 5,
    "lesson_origin": "Bài 32: BÀI 32: MI-LI-LÍT",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 6,
      "medium": 4,
      "hard": 3,
      "expert": 2
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "55": {
    "id": 55,
    "title": "Nhiệt độ & Đơn vị đo nhiệt độ (°C)",
    "full_name": "Đề 55: Nhiệt độ & Đơn vị đo nhiệt độ (°C)",
    "stage": 5,
    "lesson_origin": "Bài 33: Nhiệt độ. Đơn vị đo nhiệt độ",
    "total_questions": 11,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 11,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "56": {
    "id": 56,
    "title": "Thực hành và trải nghiệm mm, g, ml, °C",
    "full_name": "Đề 56: Thực hành và trải nghiệm mm, g, ml, °C",
    "stage": 5,
    "lesson_origin": "Bài 34: Thực hành trải nghiệm đo lường",
    "total_questions": 10,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 10,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "57": {
    "id": 57,
    "title": "Luyện tập chung Đo lường & Vượt Chặng 5",
    "full_name": "Đề 57: Luyện tập chung Đo lường & Vượt Chặng 5",
    "stage": 5,
    "lesson_origin": "Bài 35: Luyện tập chung",
    "total_questions": 10,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 10,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "58": {
    "id": 58,
    "title": "Nhân số có 3 chữ số với số có 1 chữ số",
    "full_name": "Đề 58: Nhân số có 3 chữ số với số có 1 chữ số",
    "stage": 6,
    "lesson_origin": "Bài 36: Nhân số có 3 chữ số với số có 1 chữ số",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 13,
      "medium": 2,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "59": {
    "id": 59,
    "title": "Chia số có 3 chữ số cho số có 1 chữ số",
    "full_name": "Đề 59: Chia số có 3 chữ số cho số có 1 chữ số",
    "stage": 6,
    "lesson_origin": "Bài 37 & mở rộng Bài 38",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 14,
      "medium": 1,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "60": {
    "id": 60,
    "title": "Biểu thức số và tính giá trị biểu thức",
    "full_name": "Đề 60: Biểu thức số và tính giá trị biểu thức",
    "stage": 6,
    "lesson_origin": "Bài 38: Biểu thức số. Tính giá trị của biểu thức",
    "total_questions": 15,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 12,
      "medium": 3,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "61": {
    "id": 61,
    "title": "So sánh số lớn gấp mấy lần số bé",
    "full_name": "Đề 61: So sánh số lớn gấp mấy lần số bé",
    "stage": 6,
    "lesson_origin": "Bài 39: So sánh số lớn gấp mấy lần số bé",
    "total_questions": 13,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 13,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "GIAI_TOAN"
    ],
    "category": "GIAI_TOAN"
  },
  "62": {
    "id": 62,
    "title": "Luyện tập chung phép tính trong phạm vi 1000",
    "full_name": "Đề 62: Luyện tập chung phép tính trong phạm vi 1000",
    "stage": 6,
    "lesson_origin": "Bài 40: Luyện tập chung",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 13,
      "medium": 1,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  },
  "63": {
    "id": 63,
    "title": "Ôn tập phép nhân, phép chia PV 100, 1000",
    "full_name": "Đề 63: Ôn tập phép nhân, phép chia PV 100, 1000",
    "stage": 6,
    "lesson_origin": "Bài 41: Ôn tập phép nhân, chia trong PV 100, 1000",
    "total_questions": 14,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 13,
      "medium": 1,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "64": {
    "id": 64,
    "title": "Ôn tập biểu thức số nâng cao",
    "full_name": "Đề 64: Ôn tập biểu thức số nâng cao",
    "stage": 6,
    "lesson_origin": "Bài 42: Ôn tập biểu thức số",
    "total_questions": 11,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 11,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "PHEP_TINH"
    ],
    "category": "PHEP_TINH"
  },
  "65": {
    "id": 65,
    "title": "Ôn tập hình học và đo lường tổng hợp",
    "full_name": "Đề 65: Ôn tập hình học và đo lường tổng hợp",
    "stage": 6,
    "lesson_origin": "Bài 43: Ôn tập hình học và đo lường",
    "total_questions": 11,
    "time_limit_sec": 720,
    "difficulty_summary": {
      "easy": 11,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "HINH_HOC"
    ],
    "category": "HINH_HOC"
  },
  "66": {
    "id": 66,
    "title": "Ôn tập chung & Tổng duyệt Học kỳ 1",
    "full_name": "Đề 66: Ôn tập chung & Tổng duyệt Học kỳ 1",
    "stage": 6,
    "lesson_origin": "Bài 44: Ôn tập chung",
    "total_questions": 13,
    "time_limit_sec": 900,
    "difficulty_summary": {
      "easy": 13,
      "medium": 0,
      "hard": 0,
      "expert": 0
    },
    "topics": [
      "SO_HOC"
    ],
    "category": "SO_HOC"
  }
};

export const QUESTION_BANK = [
  ...STAGE_1_QUESTIONS,
  ...STAGE_2_QUESTIONS,
  ...STAGE_3_QUESTIONS,
  ...STAGE_4_QUESTIONS,
  ...STAGE_5_QUESTIONS,
  ...STAGE_6_QUESTIONS
];

export const getQuestionsByWeek = (quizNum) => {
  const num = Number(quizNum);
  return QUESTION_BANK.filter(q => q.quiz_id === num || q.week === num);
};

export const getQuestionsByQuiz = (quizNum) => {
  return getQuestionsByWeek(quizNum);
};

export const getFilteredQuestions = ({ week, semester, stage, stageId, difficulty, category, topic, count = 10 } = {}) => {
  let list = [...QUESTION_BANK];
  const targetStage = stage || stageId;
  const targetTopic = topic || category;

  if (week && week !== 'all') {
    list = list.filter(q => q.week === Number(week) || q.quiz_id === Number(week));
  }
  if (targetStage && targetStage !== 'all') {
    list = list.filter(q => q.stage === Number(targetStage));
  }
  if (semester && semester !== 'all') {
    if (Number(semester) === 1) {
      list = list.filter(q => q.stage >= 1 && q.stage <= 6);
    }
  }
  if (difficulty && difficulty !== 'all') {
    list = list.filter(q => q.difficulty === difficulty);
  }
  if (targetTopic && targetTopic !== 'all') {
    list = list.filter(q => q.topic === targetTopic || q.category === targetTopic);
  }

  const shuffled = list.sort(() => 0.5 - Math.random());
  return count ? shuffled.slice(0, count) : shuffled;
};
