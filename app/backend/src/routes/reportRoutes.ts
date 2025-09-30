import { Router } from 'express';

import {
  createReportHandler,
  getReportHandler,
  listReportsHandler,
  updateReportStatusHandler
} from '../controllers/reportController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { uploadReportMedia } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/', authenticate, uploadReportMedia, createReportHandler);
router.get('/', authenticate, listReportsHandler);
router.get('/:id', authenticate, getReportHandler);
router.patch('/:id', authenticate, authorizeRoles('staff', 'admin'), updateReportStatusHandler);

export default router;
