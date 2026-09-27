import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Using z.ZodTypeAny makes this bulletproof against Zod version updates
export const validateSchema = (schema: z.ZodTypeAny) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      res.status(400).json({ status: 'error', message: 'Invalid request data', details: error });
    }
  };