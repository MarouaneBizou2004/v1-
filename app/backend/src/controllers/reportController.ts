import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { createReport, getReportById, listReports, updateReportStatus } from '../services/reportService.js';
import { reportCreated } from '../sockets/reportSocket.js';

const numberLike = z.preprocess(val => (typeof val === 'string' ? Number(val) : val), z.number());

const locationSchema = z.object({
  lat: numberLike,
  lng: numberLike,
  address: z.string().optional()
});

const createReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['road', 'lighting', 'sanitation', 'safety', 'other']),
  location: locationSchema
});

const statusSchema = z.object({ status: z.enum(['new', 'in_progress', 'resolved', 'rejected']) });

export async function createReportHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const location = {
    lat: req.body['location[lat]'] ?? req.body.lat ?? req.body.location?.lat,
    lng: req.body['location[lng]'] ?? req.body.lng ?? req.body.location?.lng,
    address: req.body['location[address]'] ?? req.body.address ?? req.body.location?.address
  };

  const payload = createReportSchema.parse({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location
  });

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const imageIds = files.map(() => new Types.ObjectId());

  const report = await createReport({
    ...payload,
    images: imageIds,
    createdBy: userId
  });

  reportCreated(report);
  res.status(201).json(report);
}

export async function listReportsHandler(_req: Request, res: Response): Promise<void> {
  const reports = await listReports();
  res.json(reports);
}

export async function getReportHandler(req: Request, res: Response): Promise<void> {
  const report = await getReportById(req.params.id);
  if (!report) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }
  res.json(report);
}

export async function updateReportStatusHandler(req: Request, res: Response): Promise<void> {
  const { status } = statusSchema.parse(req.body);
  const updated = await updateReportStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }
  res.json(updated);
}
