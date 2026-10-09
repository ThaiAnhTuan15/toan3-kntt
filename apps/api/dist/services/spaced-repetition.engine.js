"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacedRepetitionEngine = void 0;
class SpacedRepetitionEngine {
    /**
     * Tính toán thời điểm ôn tập tiếp theo dựa trên kết quả trả lời
     */
    static calculateNextReview(currentIntervalIndex, isCorrect, timeSpentSeconds, expectedTimeSeconds) {
        let nextIndex = currentIntervalIndex;
        if (!isCorrect) {
            // Nếu sai, reset hoặc lùi mốc ôn tập về đầu
            nextIndex = 0;
        }
        else {
            // Nếu đúng, xem xét thời gian làm bài
            // Nếu làm quá lâu, không tăng khoảng thời gian quá nhanh
            if (timeSpentSeconds > expectedTimeSeconds * 1.5) {
                // Trả lời đúng nhưng chậm, giữ nguyên mốc
                nextIndex = currentIntervalIndex;
            }
            else {
                // Trả lời đúng và nhanh, đẩy lên mốc tiếp theo
                nextIndex = Math.min(currentIntervalIndex + 1, this.INTERVALS.length - 1);
            }
        }
        const intervalDays = this.INTERVALS[nextIndex];
        // Tính ngày Review tiếp theo
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
        return {
            nextReviewDate,
            nextIntervalIndex: nextIndex,
            intervalDays
        };
    }
    /**
     * Tính điểm giữ lại kiến thức (Retention Score)
     * Sử dụng đường cong quên Ebbinghaus (giả lập)
     */
    static calculateRetention(lastReviewDate, currentMasteryLevel) {
        const daysSinceLastReview = (Date.now() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
        // Hệ số quên (nhỏ hơn => nhớ dai hơn)
        let forgettingRate = 0.1;
        switch (currentMasteryLevel) {
            case 'MASTERED':
                forgettingRate = 0.02;
                break;
            case 'PROFICIENT':
                forgettingRate = 0.05;
                break;
            case 'DEVELOPING':
                forgettingRate = 0.1;
                break;
            case 'WEAK':
                forgettingRate = 0.2;
                break;
        }
        // R = e^(-t/S) -> mô phỏng
        const retention = Math.exp(-forgettingRate * daysSinceLastReview);
        return Math.max(retention * 100, 0);
    }
}
exports.SpacedRepetitionEngine = SpacedRepetitionEngine;
// Các mốc ôn tập mặc định (tính bằng ngày)
SpacedRepetitionEngine.INTERVALS = [1, 2, 5, 10, 20, 45, 90];
