import { LearningEngine, MasteryLevel } from '../../src/services/learning.engine';

describe('LearningEngine', () => {
  it('should calculate skill score correctly', () => {
    const perf = {
      accuracy: 90,
      difficulty: 3,
      attemptCount: 5,
      recentAccuracy: 85,
      consistency: 80,
      retentionScore: 90
    };

    const score = LearningEngine.calculateSkillScore(perf);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should level up difficulty when answering 3 correct consecutively', () => {
    const nextDiff = LearningEngine.determineNextDifficulty(2, [true, true, true]);
    expect(nextDiff).toBe(3);
  });

  it('should level down difficulty when answering 2 wrong consecutively', () => {
    const nextDiff = LearningEngine.determineNextDifficulty(3, [false, false]);
    expect(nextDiff).toBe(2);
  });

  it('should bound difficulty between 1 and 5', () => {
    expect(LearningEngine.determineNextDifficulty(5, [true, true, true])).toBe(5);
    expect(LearningEngine.determineNextDifficulty(1, [false, false])).toBe(1);
  });

  it('should assign MASTERED if conditions are met', () => {
    const perf = {
      accuracy: 95,
      difficulty: 4,
      attemptCount: 10,
      recentAccuracy: 95,
      consistency: 90,
      retentionScore: 90
    };
    const mastery = LearningEngine.evaluateMastery(perf);
    expect(mastery).toBe(MasteryLevel.MASTERED);
  });
});
