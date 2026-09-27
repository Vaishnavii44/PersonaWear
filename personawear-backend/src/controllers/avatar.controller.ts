// FILE: controllers/avatar.controller.ts
import { RequestHandler } from 'express';
import { generateAvatarFromImage } from '../services/avatar.service';

export const generateAvatar: RequestHandler = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'A base64 image string is required in the "image" field.',
      });
      return;
    }

    console.log(`[Avatar] Generate request received (image size: ${Math.round(image.length / 1024)}KB)`);

    const modelUrl = await generateAvatarFromImage(image);

    res.status(200).json({
      status: 'success',
      modelUrl,
    });
  } catch (error: any) {
    console.error('[Avatar] Generation failed:', error.message);
    next(error);
  }
};
