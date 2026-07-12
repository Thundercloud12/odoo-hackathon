import type { Request, Response, NextFunction } from 'express';
import { BaseAppError, ValidationError } from '../errors/index.js';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseAppError) {
    if (!err.isOperational) {
      logger.error('Unexpected Error:', err);
    }

    const response: any = {
      success: false,
      message: err.message,
    };

    if (err instanceof ValidationError && err.errors.length > 0) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  logger.error('Unhandled Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
