import { ChatSession } from '../models/ChatSession.js';
import { Message } from '../models/Message.js';

export async function createSession(locale: string, userId?: string) {
  return ChatSession.create({ locale, userId });
}

export async function addMessage(sessionId: string, sender: 'user' | 'bot' | 'staff', text: string) {
  return Message.create({ sessionId, sender, text, attachments: [] });
}

export async function getHistory(sessionId: string) {
  return Message.find({ sessionId }).sort({ createdAt: 1 }).lean();
}
