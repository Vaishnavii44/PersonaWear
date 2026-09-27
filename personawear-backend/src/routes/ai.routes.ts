import { Router } from 'express';
import { generateOutfit, getSavedOutfits, chat, getSessions, getSessionDetails, getTrends } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect both routes using the JWT verification middleware
router.post('/generate', authenticate, generateOutfit);
router.get('/saved', authenticate, getSavedOutfits);

// Protected route for stylist demo (requires login to save sessions)
router.post('/chat', authenticate, chat);
router.get('/sessions', authenticate, getSessions);
router.get('/sessions/:id', authenticate, getSessionDetails);

// Public route for trends
router.get('/trends', getTrends);

export default router;