import { Request, Response, NextFunction } from 'express';

// The actual middleware (We will put a mock user here for now)
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Replace this with actual JWT verification later
  req.user = { id: 'test-user-uuid-1234', email: 'test@example.com' }; 
  
  next();
};