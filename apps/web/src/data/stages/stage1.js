export const STAGE_1_QUESTIONS = [
  // TUẦN 1: Ôn tập các số đến 1000 & Phép cộng trừ
  {
    id: "w1_1",
    week: 1,
    topic: "SO_HOC",
    difficulty: "easy",
    question: "Số gồm 5 trăm, 4 chục và 3 đơn vị được viết là:",
    options: ["534", "543", "453", "345"],
    correctIndex: 1,
    explanation: "Số gồm 5 trăm, 4 chục, 3 đơn vị viết là 543."
  },
  {
    id: "w1_2",
    week: 1,
    topic: "PHEP_TINH",
    difficulty: "medium",
    question: "Kết quả của phép tính 350 + 120 là:",
    options: ["470", "450", "480", "570"],
    correctIndex: 0,
    explanation: "Thực hiện phép tính cộng: 350 + 120 = 470."
  },
  {
    id: "w1_3",
    week: 1,
    topic: "PHEP_TINH",
    difficulty: "hard",
    question: "Một cửa hàng buổi sáng bán được 250 kg gạo, buổi chiều bán được ít hơn buổi sáng 50 kg. Cả hai buổi cửa hàng bán được bao nhiêu ki-lô-gam gạo?",
    options: ["450 kg", "200 kg", "400 kg", "500 kg"],
    correctIndex: 0,
    explanation: "Buổi chiều bán được: 250 - 50 = 200 (kg). Cả hai buổi bán được: 250 + 200 = 450 (kg)."
  },

  // TUẦN 2: Tìm thành phần chưa biết của phép tính
  {
    id: "w2_1",
    week: 2,
    topic: "PHEP_TINH",
    difficulty: "easy",
    question: "Tìm x, biết: x + 125 = 300",
    options: ["175", "425", "275", "185"],
    correctIndex: 0,
    explanation: "Muốn tìm số hạng chưa biết, ta lấy tổng trừ đi số hạng kia. x = 300 - 125 = 175."
  },
  {
    id: "w2_2",
    week: 2,
    topic: "PHEP_TINH",
    difficulty: "medium",
    question: "Tìm số bị trừ, biết hiệu là 150 và số trừ là 200.",
    options: ["350", "50", "250", "400"],
    correctIndex: 0,
    explanation: "Số bị trừ = Hiệu + Số trừ = 150 + 200 = 350."
  },

  // TUẦN 3: Ôn tập bảng nhân chia 2, 5; Bảng 3
  {
    id: "w3_1",
    week: 3,
    topic: "PHEP_TINH",
    difficulty: "easy",
    question: "Kế quả của phép tính 3 × 6 là:",
    options: ["18", "24", "15", "12"],
    correctIndex: 0,
    explanation: "Theo bảng nhân 3, ta có: 3 × 6 = 18."
  },
  {
    id: "w3_2",
    week: 3,
    topic: "PHEP_TINH",
    difficulty: "medium",
    question: "Có 27 học sinh chia đều thành 3 tổ. Hỏi mỗi tổ có bao nhiêu học sinh?",
    options: ["9 học sinh", "8 học sinh", "7 học sinh", "10 học sinh"],
    correctAnswer: "9 học sinh",
    explanation: "Số học sinh mỗi tổ là: 27 : 3 = 9 (học sinh)."
  },

  // TUẦN 4: Bảng nhân 4, chia 4
  {
    id: "w4_1",
    week: 4,
    topic: "PHEP_TINH",
    difficulty: "easy",
    question: "Điền số thích hợp vào chỗ chấm: 4 × ... = 32",
    options: ["7", "8", "9", "6"],
    correctIndex: 1,
    explanation: "Theo bảng nhân 4, ta có 4 × 8 = 32."
  },

  // TUẦN 5: Gấp, giảm số lần
  {
    id: "w5_1",
    week: 5,
    topic: "GIAI_TOAN",
    difficulty: "medium",
    question: "An có 5 quyển vở. Số vở của Bình gấp 3 lần số vở của An. Hỏi Bình có bao nhiêu quyển vở?",
    options: ["8", "10", "15", "20"],
    correctIndex: 2,
    explanation: "Số vở của Bình là: 5 × 3 = 15 (quyển vở)."
  },

  // TUẦN 6, 7, 8, 9 (Stubs to ensure it works)
  {
    id: "w6_1",
    week: 6,
    topic: "PHEP_TINH",
    difficulty: "easy",
    question: "6 × 7 = ?",
    options: ["42", "48", "36", "49"],
    correctIndex: 0,
    explanation: "6 × 7 = 42"
  },
  {
    id: "w9_1",
    week: 9,
    topic: "SO_HOC",
    difficulty: "medium",
    question: "Số liền trước của 1000 là số nào?",
    options: ["999", "990", "1001", "900"],
    correctIndex: 0,
    explanation: "Số liền trước của 1000 là 1000 - 1 = 999."
  }
];

