import bcrypt from 'bcrypt';

import { User } from '../models/User.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'citizen' | 'staff' | 'admin';
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name,
    email: input.email,
    role: input.role ?? 'citizen',
    passwordHash
  });

  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const payload = { sub: user.id, role: user.role };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user
  };
}
