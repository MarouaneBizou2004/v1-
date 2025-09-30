import type { Request, Response } from 'express';
import { z } from 'zod';

import { authenticateUser, registerUser } from '../services/authService.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['citizen', 'staff', 'admin']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const user = await registerUser(input);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authenticateUser(email, password);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
}

const refreshSchema = z.object({ refreshToken: z.string().min(1) });

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = refreshSchema.parse(req.body);
  const payload = verifyToken(refreshToken);
  const newPayload = { sub: payload.sub, role: payload.role };
  res.json({
    accessToken: signAccessToken(newPayload),
    refreshToken: signRefreshToken(newPayload)
  });
}
