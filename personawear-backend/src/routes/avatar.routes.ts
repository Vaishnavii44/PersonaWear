// FILE: routes/avatar.routes.ts
import { Router } from 'express';
import { generateAvatar } from '../controllers/avatar.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/avatar/generate — generate a 3D model from an uploaded photo
// Protected by JWT authentication
router.post('/generate', authenticate, generateAvatar);

export default router;
