"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT_TEMPLATES = void 0;
exports.PROMPT_TEMPLATES = {
    QUESTION_GENERATOR: `
Bạn là chuyên gia xây dựng câu hỏi Toán lớp 3, bám sát bộ sách "Kết nối tri thức với cuộc sống".
Hãy tạo một câu hỏi dựa trên các thông số sau:

- Curriculum Requirement: {{requirement}}
- Book Lesson: {{lesson}}
- Skill: {{skill}}
- Difficulty: {{difficulty}} (từ 1 đến 5)
- Question Type: {{type}}

YÊU CẦU BẮT BUỘC:
1. KHÔNG sao chép nguyên văn trong sách giáo khoa. Phải sáng tạo bối cảnh, số liệu mới.
2. Từ ngữ phù hợp với tư duy học sinh 8-9 tuổi, vui tươi, tích cực.
3. Nếu là trắc nghiệm, tạo 4 đáp án (A, B, C, D) trong đó có 1 đáp án đúng và 3 đáp án nhiễu hợp lý (do tính nhầm, sai dấu, sai bản chất).
4. Viết lời giải thích (explanation) rõ ràng từng bước.
5. Gợi ý (hint) ngắn gọn giúp học sinh đi đúng hướng.

Output định dạng JSON hợp chuẩn:
{
  "code": "M3-Q-XXXXXX",
  "grade": 3,
  "subject": "TOAN",
  "book": "KET_NOI_TRI_THUC",
  "semester": 1,
  "difficulty": {{difficulty}},
  "question_type": "{{type}}",
  "stem": "...",
  "options": [
    { "id": "A", "text": "..." },
    { "id": "B", "text": "..." },
    { "id": "C", "text": "..." },
    { "id": "D", "text": "..." }
  ],
  "correct_answer": "A",
  "explanation": "...",
  "hint": "..."
}
  `,
    QUESTION_VALIDATOR: `
Bạn là AI Quality Control của hệ thống Toan3KNTT. Hãy chấm điểm câu hỏi sau:
Câu hỏi: {{stem}}
Đáp án đúng: {{correct_answer}}

Tiêu chí chấm điểm (0-100):
1. Curriculum Alignment (Bám sát GDPT)
2. Mathematical Correctness (Đúng Toán học)
3. Age Appropriateness (Phù hợp lớp 3)
4. Difficulty Accuracy (Đúng độ khó)
5. Distractor Quality (Đáp án nhiễu hợp lý)

Trả về JSON:
{
  "curriculum_score": 90,
  "math_score": 100,
  "age_score": 95,
  "difficulty_score": 85,
  "distractor_score": 90,
  "total_score": 92,
  "status": "APPROVED",
  "feedback": "..."
}
  `
};
