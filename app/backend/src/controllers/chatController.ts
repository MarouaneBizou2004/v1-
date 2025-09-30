import type { Request, Response } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { addMessage, createSession, getHistory } from '../services/chatService.js';

const sessionSchema = z.object({
  locale: z.string().default('en')
});

const messageSchema = z.object({
  sessionId: z.string(),
  sender: z.enum(['user', 'bot', 'staff']),
  text: z.string().min(1)
});

export async function createSessionHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { locale } = sessionSchema.parse(req.body);
  const session = await createSession(locale, req.user?.id);
  res.status(201).json(session);
}

export async function sendMessageHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const input = messageSchema.parse(req.body);
  const message = await addMessage(input.sessionId, input.sender, input.text);
  res.status(201).json(message);
}

export async function getHistoryHandler(req: Request, res: Response): Promise<void> {
  const history = await getHistory(req.params.sessionId);
  res.json(history);
}
