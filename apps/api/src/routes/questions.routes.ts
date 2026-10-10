import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get questions by week (lesson)
router.get('/', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: true,
        lesson: true
      }
    });
    
    // Map backend model to frontend expected format
    const mappedQuestions = questions.map(q => {
      let diff = 'easy';
      if (q.difficulty === 3) diff = 'medium';
      if (q.difficulty === 5) diff = 'hard';

      const correctIndex = q.options.findIndex(opt => opt.isCorrect);

      return {
        id: q.code,
        week: q.lesson ? q.lesson.lessonOrder : 1,
        stage: Math.ceil((q.lesson ? q.lesson.lessonOrder : 1) / 9) || 1,
        category: 'natural_num',
        difficulty: diff,
        question: q.stem,
        options: q.options.map(opt => opt.text),
        correctIndex: correctIndex >= 0 ? correctIndex : 0,
        hint: q.hint,
        explanation: q.explanation
      };
    });

    res.json(mappedQuestions);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

export default router;
