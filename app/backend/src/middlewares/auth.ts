import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { HttpError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    throw new HttpError(401, 'Authorization header missing');
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    throw new HttpError(401, 'Invalid token');
  }
};

export const requireRole = (roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new HttpError(403, 'Forbidden');
  }
  next();
};
