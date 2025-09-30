import jwt from 'jsonwebtoken';

import { env } from '../config/env';

interface TokenPayload {
  sub: string;
  role: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as TokenPayload;
