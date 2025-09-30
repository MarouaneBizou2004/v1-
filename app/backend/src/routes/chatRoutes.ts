import { Router } from 'express';

import { createSession, getHistory, postMessage } from '../controllers/chatController';

export const chatRouter = Router();

chatRouter.post('/session', createSession);
chatRouter.post('/message', postMessage);
chatRouter.get('/history/:sessionId', getHistory);
