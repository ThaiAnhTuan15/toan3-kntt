import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getChildProgress } from '../controllers/parent.controller';

const router = Router();

router.use(authenticate, authorize(['PARENT']));

router.get('/child-progress', getChildProgress);

export default router;
