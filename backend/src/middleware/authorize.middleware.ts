import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/index.js';

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};
