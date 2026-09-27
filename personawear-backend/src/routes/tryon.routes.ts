import { Router } from 'express';
import { generateTryOn } from '../controllers/tryon.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected route - must be logged in to use virtual try-on
router.post('/generate', authenticate, generateTryOn);

export default router;
