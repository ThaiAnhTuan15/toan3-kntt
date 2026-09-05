import prisma from '../config/db';

export class AnalyticsService {
  /**
   * Phân tích chất lượng câu hỏi (Question Analytics)
   * Để phát hiện các câu hỏi quá khó, quá dễ, hoặc có lỗi
   */
  static async getQuestionAnalytics(questionId: string) {
    const answers = await prisma.answer.findMany({
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
    } else if (accuracy > 95) {
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
  }

  /**
   * Phân tích Khoảng trống Chương trình (Curriculum Gap Analysis)
   * Tìm ra những Yêu cầu cần đạt nào đang bị thiếu câu hỏi luyện tập
   */
  static async getCurriculumGaps(curriculumId: string) {
    const requirements = await prisma.curriculumRequirement.findMany({
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
      if (qCount === 0) gapStatus = 'CRITICAL_MISSING';
      else if (qCount < 5) gapStatus = 'LOW_COVERAGE';
      else if (level3 === 0) gapStatus = 'MISSING_HIGH_LEVEL';

      return {
        requirementCode: req.code,
        totalQuestions: qCount,
        gapStatus,
        details: `L1: ${level1}, L3: ${level3}`
      };
    }).filter(g => g.gapStatus !== 'OK');

    return gaps;
  }
}
