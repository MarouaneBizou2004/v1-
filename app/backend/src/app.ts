import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { authRouter } from './routes/authRoutes';
import { chatRouter } from './routes/chatRoutes';
import { reportRouter } from './routes/reportRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/reports', reportRouter);
app.use(errorHandler);

export default app;
