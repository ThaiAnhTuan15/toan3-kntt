"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationEngine = void 0;
class RecommendationEngine {
    /**
     * Đề xuất hoạt động tốt nhất tiếp theo cho học sinh
     * "Học sinh này nên học gì tiếp theo?"
     */
    static getNextBestActivity(skills, currentLessonId) {
        // 1. Ưu tiên cao nhất: Kỹ năng đã đến hạn ôn tập (Spaced Repetition)
        const dueForReview = skills.filter(s => s.isDueForReview);
        if (dueForReview.length > 0) {
            return {
                type: 'REVIEW',
                message: 'Em có một vài kiến thức cũ cần ôn lại trước khi đi tiếp nhé!',
                skillIds: dueForReview.map(s => s.skillId).slice(0, 3) // Lấy tối đa 3 kỹ năng để ôn
            };
        }
        // 2. Ưu tiên hai: Lấp lỗ hổng kiến thức (WEAK skills) của các bài đã học
        const weakSkills = skills.filter(s => s.level === 'WEAK' || s.level === 'DEVELOPING')
            .sort((a, b) => b.priority - a.priority);
        if (weakSkills.length > 0) {
            return {
                type: 'REMEDIAL',
                message: 'Mình cùng luyện tập thêm để nắm vững phần này nhé!',
                skillIds: [weakSkills[0].skillId]
            };
        }
        // 3. Ưu tiên ba: Học bài mới theo lộ trình
        return {
            type: 'NEW_LESSON',
            message: 'Em đã hoàn thành xuất sắc! Bây giờ mình cùng sang bài mới nhé.',
            lessonId: currentLessonId // Đáng lẽ phải gọi hàm getNextLesson(currentLessonId)
        };
    }
}
exports.RecommendationEngine = RecommendationEngine;
