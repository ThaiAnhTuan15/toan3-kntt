import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getProgress, updateProgress } from '../controllers/student.controller';

const router = Router();

router.get('/progress', authenticate, authorize(['STUDENT']), getProgress);
router.put('/progress', authenticate, authorize(['STUDENT']), updateProgress);

export default router;
