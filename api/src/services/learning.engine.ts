export enum MasteryLevel {
  WEAK = 'WEAK',
  DEVELOPING = 'DEVELOPING',
  PROFICIENT = 'PROFICIENT',
  MASTERED = 'MASTERED'
}

export interface SkillPerformance {
  accuracy: number;
  difficulty: number;
  attemptCount: number;
  recentAccuracy: number;
  consistency: number;
  retentionScore: number;
}

export class LearningEngine {
  /**
   * Tính toán Skill Score tổng hợp dựa trên nhiều yếu tố
   */
  static calculateSkillScore(perf: SkillPerformance): number {
    const W_ACCURACY = 0.3;
    const W_DIFFICULTY = 0.2;
    const W_RECENT = 0.3;
    const W_CONSISTENCY = 0.1;
    const W_RETENTION = 0.1;

    // Normalize difficulty (1-5 to 0-1)
    const normDifficulty = perf.difficulty / 5.0;

    const score = 
      (perf.accuracy * W_ACCURACY) +
      (normDifficulty * 100 * W_DIFFICULTY) +
      (perf.recentAccuracy * W_RECENT) +
      (perf.consistency * W_CONSISTENCY) +
      (perf.retentionScore * W_RETENTION);

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Phân loại Mastery Level của học sinh
   */
  static evaluateMastery(perf: SkillPerformance): MasteryLevel {
    const score = this.calculateSkillScore(perf);

    if (perf.attemptCount < 3) {
      return score >= 70 ? MasteryLevel.DEVELOPING : MasteryLevel.WEAK;
    }

    if (score >= 85 && perf.recentAccuracy >= 85 && perf.consistency >= 80) {
      return MasteryLevel.MASTERED;
    } else if (score >= 70) {
      return MasteryLevel.PROFICIENT;
    } else if (score >= 50) {
      return MasteryLevel.DEVELOPING;
    } else {
      return MasteryLevel.WEAK;
    }
  }

  /**
   * Thuật toán điều chỉnh độ khó (Adaptive Learning)
   * Quyết định Level cho câu hỏi tiếp theo
   */
  static determineNextDifficulty(
    currentDifficulty: number, 
    lastResults: boolean[] // Mảng kết quả các câu gần nhất (vd: [true, true, false])
  ): number {
    if (lastResults.length === 0) return currentDifficulty;

    const consecutiveCorrect = lastResults.reduce((acc, val) => (val ? acc + 1 : 0), 0);
    const consecutiveWrong = lastResults.reduce((acc, val) => (!val ? acc + 1 : 0), 0);

    let nextDifficulty = currentDifficulty;

    // Tăng độ khó nếu đúng liên tiếp 3 câu
    if (consecutiveCorrect >= 3) {
      nextDifficulty++;
    } 
    // Giảm độ khó nếu sai liên tiếp 2 câu
    else if (consecutiveWrong >= 2) {
      nextDifficulty--;
    }

    return Math.min(Math.max(nextDifficulty, 1), 5); // Khóa trong khoảng Level 1-5
  }
}
