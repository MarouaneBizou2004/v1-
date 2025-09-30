import { Router } from 'express';

import { authenticate, requireRole } from '../middlewares/auth';
import { createReport, getReport, listReports, updateReportStatus } from '../controllers/reportController';
import { upload } from '../services/storageService';

export const reportRouter = Router();

reportRouter.use(authenticate);

reportRouter.post('/', upload.array('images'), createReport);
reportRouter.get('/', listReports);
reportRouter.get('/:id', getReport);
reportRouter.patch('/:id', requireRole(['staff', 'admin']), updateReportStatus);
