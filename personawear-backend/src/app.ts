import authRoutes from './routes/auth.routes';
import analyticsRoutes from './routes/analytics.routes';
import communityRoutes from './routes/community.routes';
import aiRoutes from './routes/ai.routes';
import avatarRoutes from './routes/avatar.routes';
import tryonRoutes from './routes/tryon.routes';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wardrobeRoutes from './routes/wardrobe.routes';
import { v2 as cloudinary } from 'cloudinary';

// 1. Load environment variables FIRST so Cloudinary can read them
dotenv.config();

// 2. Configure Cloudinary globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// --- Global Middleware ---
// Allow your frontend (running on port 3000) to communicate with this backend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// 3. INCREASED UPLOAD LIMITS FOR IMAGES (50mb)
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Health Check Route ---
// A simple endpoint to verify the server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'PersonaWear API is online.' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tryon', tryonRoutes);

// --- Global Error Handler ---
import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};

app.use(errorHandler);

export default app;