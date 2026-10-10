"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const prompts_1 = require("../config/prompts");
// Giả lập thư viện gọi AI (ví dụ: OpenAI SDK hoặc Google Generative AI)
const mockAiCall = (prompt, variables) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('--- GỌI AI API ---');
    return JSON.stringify({
        success: true,
        data: "Mock AI Response",
        metadata: variables
    });
});
class AIService {
    /**
     * Sinh lời giải tự động cho câu hỏi mà học sinh làm sai
     * Áp dụng AI Cache để không gọi AI nhiều lần cho cùng 1 câu hỏi + đáp án sai
     */
    static generateExplanation(questionId, studentWrongAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const aiResponse = yield mockAiCall(prompt, { questionId });
            const generatedExplanation = `Đây là gợi ý tự động: Khi làm bài này em cần chú ý tính từ phải sang trái. (Sinh bởi AI)`;
            // 3. Lưu vào Cache để dùng cho học sinh sau
            this.explanationCache.set(cacheKey, generatedExplanation);
            return {
                source: 'AI_API',
                explanation: generatedExplanation
            };
        });
    }
    /**
     * Sinh câu hỏi mới hoàn toàn bằng AI
     */
    static generateQuestions(topic_1, lesson_1, difficulty_1) {
        return __awaiter(this, arguments, void 0, function* (topic, lesson, difficulty, count = 1) {
            let rawPrompt = prompts_1.PROMPT_TEMPLATES.QUESTION_GENERATOR;
            rawPrompt = rawPrompt.replace('{{lesson}}', lesson)
                .replace('{{difficulty}}', difficulty.toString());
            // Gọi API AI
            const result = yield mockAiCall(rawPrompt, { topic, count });
            // Trả về JSON (Trong thực tế cần Parse JSON từ chuỗi AI trả về)
            return {
                status: 'AI_GENERATED',
                questions: [
                    {
                        code: `M3-Q-AI-${Math.floor(Math.random() * 10000)}`,
                        stem: `Một câu hỏi sinh bởi AI về ${lesson} mức độ ${difficulty}`,
                        difficulty: difficulty
                    }
                ]
            };
        });
    }
}
exports.AIService = AIService;
// Bộ nhớ đệm (Cache) trong RAM để lưu kết quả AI, giảm chi phí API
AIService.explanationCache = new Map();
