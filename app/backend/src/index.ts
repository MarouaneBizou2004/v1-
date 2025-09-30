import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';

import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { registerReportSocket } from './sockets/reportSocket.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientOrigin
  }
});

registerReportSocket(io);

io.on('connection', socket => {
  logger.info(`Socket connected: ${socket.id}`);
});

void connectDatabase().then(() => {
  server.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
});

export { app };
