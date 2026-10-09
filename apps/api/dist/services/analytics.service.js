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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const db_1 = __importDefault(require("../config/db"));
class AnalyticsService {
    /**
     * Phân tích chất lượng câu hỏi (Question Analytics)
     * Để phát hiện các câu hỏi quá khó, quá dễ, hoặc có lỗi
     */
    static getQuestionAnalytics(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = yield db_1.default.answer.findMany({
                where: { questionId }
            });
            if (answers.length === 0) {
                return { status: 'NO_DATA' };
            }
            const totalAttempts = answers.length;
            const correctCount = answers.filter(a => a.isCorrect).length;
            const wrongCount = totalAttempts - correctCount;
            const accuracy = (correctCount / totalAttempts) * 100;
            const totalTime = answers.reduce((acc, curr) => acc + curr.timeSpent, 0);
            const avgTimeSeconds = totalTime / totalAttempts;
            let difficultyFit = 'GOOD';
            // Đánh giá sự phù hợp của độ khó dựa trên tỷ lệ đúng
            // Nếu câu hỏi Level 1 (Dễ) mà tỷ lệ đúng < 40% -> Đang bị phân loại sai độ khó
            if (accuracy < 20) {
                difficultyFit = 'TOO_HARD_OR_CONFUSING';
            }
            else if (accuracy > 95) {
                difficultyFit = 'TOO_EASY';
            }
            return {
                questionId,
                totalAttempts,
                accuracy: accuracy.toFixed(2) + '%',
                wrongRate: ((wrongCount / totalAttempts) * 100).toFixed(2) + '%',
                avgTimeSeconds: Math.round(avgTimeSeconds),
                difficultyFit
            };
        });
    }
    /**
     * Phân tích Khoảng trống Chương trình (Curriculum Gap Analysis)
     * Tìm ra những Yêu cầu cần đạt nào đang bị thiếu câu hỏi luyện tập
     */
    static getCurriculumGaps(curriculumId) {
        return __awaiter(this, void 0, void 0, function* () {
            const requirements = yield db_1.default.curriculumRequirement.findMany({
                where: { curriculumId },
                include: {
                    questions: { select: { id: true, difficulty: true } }
                }
            });
            const gaps = requirements.map(req => {
                const qCount = req.questions.length;
                const level1 = req.questions.filter(q => q.difficulty === 1).length;
                const level3 = req.questions.filter(q => q.difficulty === 3).length;
                let gapStatus = 'OK';
                if (qCount === 0)
                    gapStatus = 'CRITICAL_MISSING';
                else if (qCount < 5)
                    gapStatus = 'LOW_COVERAGE';
                else if (level3 === 0)
                    gapStatus = 'MISSING_HIGH_LEVEL';
                return {
                    requirementCode: req.code,
                    totalQuestions: qCount,
                    gapStatus,
                    details: `L1: ${level1}, L3: ${level3}`
                };
            }).filter(g => g.gapStatus !== 'OK');
            return gaps;
        });
    }
}
exports.AnalyticsService = AnalyticsService;
