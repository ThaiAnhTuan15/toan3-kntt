import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getQuestionStats, getCurriculumGaps, generateAIExplanation } from '../controllers/analytics.controller';

const router = Router();

// Routes cho Admin/Teacher
router.get('/questions/:questionId', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), getQuestionStats);
router.get('/curriculum-gaps', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), getCurriculumGaps);

// Routes cho Student gọi khi cần giải thích tự động
router.post('/ai-explain', authenticate, authorize(['STUDENT']), generateAIExplanation);

export default router;
