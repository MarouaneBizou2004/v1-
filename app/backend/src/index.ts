import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import app from './app';
import { env } from './config/env';
import { registerReportSocket } from './sockets/reportSocket';
import { logger } from './utils/logger';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.clientOrigin } });
const reportSocket = registerReportSocket(io);

app.locals.reportSocket = reportSocket;

export const start = async () => {
  await mongoose.connect(env.mongoUri);
  server.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
  return server;
};

if (require.main === module) {
  start().catch((error) => {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
}

export default app;
