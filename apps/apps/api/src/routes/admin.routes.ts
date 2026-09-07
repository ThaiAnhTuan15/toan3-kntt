import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getQuestions, createQuestion, updateQuestionStatus } from '../controllers/admin.question.controller';

const router = Router();

// Chỉ SUPER_ADMIN và ADMIN mới được truy cập các API này
router.use(authenticate, authorize(['SUPER_ADMIN', 'ADMIN']));

router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.patch('/questions/:id/status', updateQuestionStatus);

export default router;
