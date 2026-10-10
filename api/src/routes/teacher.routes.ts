import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getClassAnalytics } from '../controllers/teacher.controller';

const router = Router();

router.use(authenticate, authorize(['TEACHER']));

router.get('/class-analytics', getClassAnalytics);

export default router;
