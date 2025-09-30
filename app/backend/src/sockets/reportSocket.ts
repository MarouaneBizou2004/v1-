import type { Server } from 'socket.io';

export const registerReportSocket = (io: Server) => {
  const namespace = io.of('/reports');
  namespace.on('connection', (socket) => {
    socket.emit('connected');
  });

  return {
    notifyReportCreated: (reportId: string) => {
      namespace.emit('report:created', { id: reportId });
    }
  };
};
