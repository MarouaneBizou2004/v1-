import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

import { HttpError } from '../middlewares/errorHandler';
import { ChatSessionModel } from '../models/ChatSession';
import { MessageModel } from '../models/Message';

const sessionSchema = z.object({
  userId: z.string().optional(),
  locale: z.enum(['en', 'fr', 'ar']).default('en')
});

const messageSchema = z.object({
  sessionId: z.string(),
  sender: z.enum(['user', 'bot', 'staff']),
  text: z.string().min(1)
});

export const createSession = async (req: Request, res: Response) => {
  const parsed = sessionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  const session = await ChatSessionModel.create({
    locale: parsed.data.locale,
    userId: parsed.data.userId ? new Types.ObjectId(parsed.data.userId) : undefined
  });
  res.status(201).json({ id: session.id, locale: session.locale });
};

export const postMessage = async (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  const message = await MessageModel.create({
    sessionId: new Types.ObjectId(parsed.data.sessionId),
    sender: parsed.data.sender,
    text: parsed.data.text
  });
  res.status(201).json({ id: message.id });
};

export const getHistory = async (req: Request, res: Response) => {
  const history = await MessageModel.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 }).lean();
  res.json(history);
};
