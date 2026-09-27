import { Router } from 'express';
import { uploadPost, getFeed, toggleLike, toggleSave } from '../controllers/community.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - must be logged in to view feed, post, like, or save
router.get('/', authenticate, getFeed);

// Protected routes - must be logged in to post, like, or save
router.post('/upload', authenticate, uploadPost);
router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/save', authenticate, toggleSave);

export default router;