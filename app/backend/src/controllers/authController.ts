import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { HttpError } from '../middlewares/errorHandler';
import { UserModel } from '../models/User';
import { generateTokens, verifyToken } from '../services/tokenService';

const authSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = authSchema.pick({ email: true, password: true });

export const register = async (req: Request, res: Response) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  const { name, email, password } = parsed.data;
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new HttpError(409, 'User already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, passwordHash, role: 'citizen' });
  const tokens = generateTokens({ sub: user.id, role: user.role });
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, 'Invalid credentials');
  }
  const tokens = generateTokens({ sub: user.id, role: user.role });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens });
};

export const refresh = (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    throw new HttpError(400, 'refreshToken is required');
  }
  try {
    const payload = verifyToken(refreshToken);
    const tokens = generateTokens(payload);
    res.json(tokens);
  } catch (error) {
    throw new HttpError(401, 'Invalid refresh token');
  }
};
