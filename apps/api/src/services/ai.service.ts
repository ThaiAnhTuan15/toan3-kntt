import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  private static explanationCache = new Map<string, string>();
  private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  static async generateExplanation(questionText: string, correctAnswer: string, studentWrongAnswer: string) {
    const cacheKey = `${questionText}_${studentWrongAnswer}`;
    
    if (this.explanationCache.has(cacheKey)) {
      return {
        source: 'CACHE',
        explanation: this.explanationCache.get(cacheKey)
      };
    }

    try {
      if (!process.env.GEMINI_API_KEY) {
        return {
          source: 'FALLBACK',
          explanation: 'Tính năng AI chưa được cấu hình API Key. Hãy nhờ thầy cô hoặc phụ huynh giải thích nhé!'
        };
      }

      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Bạn là "Cú Mèo Thông Thái", một trợ giảng môn Toán lớp 3 siêu dễ thương và tâm lý.
Học sinh vừa làm sai một câu hỏi toán học. 
Câu hỏi là: "${questionText}"
Đáp án đúng là: "${correctAnswer}"
Học sinh đã chọn sai đáp án là: "${studentWrongAnswer}"

Hãy đóng vai Cú Mèo, viết một đoạn ngắn (3-4 câu) giải thích thật dễ hiểu cho học sinh lớp 3 tại sao lại sai, và gợi ý cách làm đúng. Dùng giọng điệu nhẹ nhàng, vui vẻ, xưng "Cú Mèo" và gọi học sinh là "bạn nhỏ" hoặc "em".`;

      const result = await model.generateContent(prompt);
      const generatedExplanation = result.response.text();

      this.explanationCache.set(cacheKey, generatedExplanation);

      return {
        source: 'AI_API',
        explanation: generatedExplanation
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        source: 'ERROR',
        explanation: 'Cú Mèo đang bận chút xíu, em hãy xem lại phần Giải thích tiêu chuẩn ở trên nhé!'
      };
    }
  }
}
