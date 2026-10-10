import { PROMPT_TEMPLATES } from '../config/prompts';

// Giả lập thư viện gọi AI (ví dụ: OpenAI SDK hoặc Google Generative AI)
const mockAiCall = async (prompt: string, variables: any) => {
  console.log('--- GỌI AI API ---');
  return JSON.stringify({
    success: true,
    data: "Mock AI Response",
    metadata: variables
  });
};

export class AIService {
  // Bộ nhớ đệm (Cache) trong RAM để lưu kết quả AI, giảm chi phí API
  private static explanationCache = new Map<string, string>();

  /**
   * Sinh lời giải tự động cho câu hỏi mà học sinh làm sai
   * Áp dụng AI Cache để không gọi AI nhiều lần cho cùng 1 câu hỏi + đáp án sai
   */
  static async generateExplanation(questionId: string, studentWrongAnswer: string) {
    const cacheKey = `${questionId}_${studentWrongAnswer}`;
    
    // 1. Kiểm tra Cache
    if (this.explanationCache.has(cacheKey)) {
      return {
        source: 'CACHE',
        explanation: this.explanationCache.get(cacheKey)
      };
    }

    // 2. Nếu không có trong cache, tiến hành gọi AI
    // (Trong thực tế cần nối chuỗi prompt và fetch từ CSDL nội dung câu hỏi)
    const prompt = `Học sinh đã chọn đáp án ${studentWrongAnswer} cho câu hỏi ${questionId}. Hãy giải thích tại sao sai và gợi ý cách giải đúng ngắn gọn nhất.`;
    
    // Gọi API AI
    const aiResponse = await mockAiCall(prompt, { questionId });
    const generatedExplanation = `Đây là gợi ý tự động: Khi làm bài này em cần chú ý tính từ phải sang trái. (Sinh bởi AI)`;

    // 3. Lưu vào Cache để dùng cho học sinh sau
    this.explanationCache.set(cacheKey, generatedExplanation);

    return {
      source: 'AI_API',
      explanation: generatedExplanation
    };
  }

  /**
   * Sinh câu hỏi mới hoàn toàn bằng AI
   */
  static async generateQuestions(topic: string, lesson: string, difficulty: number, count: number = 1) {
    let rawPrompt = PROMPT_TEMPLATES.QUESTION_GENERATOR;
    rawPrompt = rawPrompt.replace('{{lesson}}', lesson)
                         .replace('{{difficulty}}', difficulty.toString());

    // Gọi API AI
    const result = await mockAiCall(rawPrompt, { topic, count });
    
    // Trả về JSON (Trong thực tế cần Parse JSON từ chuỗi AI trả về)
    return {
      status: 'AI_GENERATED',
      questions: [
        {
          code: `M3-Q-AI-${Math.floor(Math.random()*10000)}`,
          stem: `Một câu hỏi sinh bởi AI về ${lesson} mức độ ${difficulty}`,
          difficulty: difficulty
        }
      ]
    };
  }
}
