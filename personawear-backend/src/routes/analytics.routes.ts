import { Router } from 'express';
import { getDashboard } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected route - returns the analytics dashboard for the logged-in user
router.get('/dashboard', authenticate, getDashboard);

export default router;