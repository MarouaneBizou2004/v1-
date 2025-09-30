import { Router } from 'express';

import { createSessionHandler, getHistoryHandler, sendMessageHandler } from '../controllers/chatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/session', authenticate, createSessionHandler);
router.post('/message', authenticate, sendMessageHandler);
router.get('/history/:sessionId', authenticate, getHistoryHandler);

export default router;
