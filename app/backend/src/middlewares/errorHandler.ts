import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const status = err instanceof HttpError ? err.status : 500;
  logger.error(err.message);
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
