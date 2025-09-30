import type { Server } from 'socket.io';

import type { ReportDocument } from '../models/Report.js';

let ioInstance: Server | null = null;

export function registerReportSocket(io: Server): void {
  ioInstance = io;
}

export function reportCreated(report: ReportDocument): void {
  if (!ioInstance) {
    return;
  }
  ioInstance.emit('report:created', {
    id: report.id,
    title: report.title,
    category: report.category,
    status: report.status,
    createdAt: report.createdAt
  });
}
