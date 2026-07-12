import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/index.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement actual JWT verification here
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Authentication token missing'));
  }

  // Example dummy payload
  (req as any).user = { id: 1, role: 'Fleet Manager' };
  next();
};
