import type { Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

import type { AuthRequest } from '../middlewares/auth';
import { HttpError } from '../middlewares/errorHandler';
import { ReportModel } from '../models/Report';
import { mapFilesToIds } from '../services/storageService';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional()
});

const createReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['road', 'lighting', 'sanitation', 'safety', 'other']),
  location: locationSchema
});

const updateStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved', 'rejected'])
});

export const createReport = async (req: AuthRequest, res: Response) => {
  const parsed = createReportSchema.safeParse({
    ...req.body,
    location: req.body.location ? JSON.parse(req.body.location) : undefined
  });
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  const images = mapFilesToIds(req.files as Express.Multer.File[]);
  const report = await ReportModel.create({
    ...parsed.data,
    images: images.map((_imageId) => new Types.ObjectId()),
    createdBy: new Types.ObjectId(req.user?.id)
  });
  res.status(201).json({ id: report.id, trackingNumber: report.id, status: report.status });
};

export const listReports = async (_req: AuthRequest, res: Response) => {
  const reports = await ReportModel.find().sort({ createdAt: -1 }).lean();
  res.json(reports);
};

export const getReport = async (req: AuthRequest, res: Response) => {
  const report = await ReportModel.findById(req.params.id).lean();
  if (!report) {
    throw new HttpError(404, 'Report not found');
  }
  res.json(report);
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.message);
  }
  const report = await ReportModel.findByIdAndUpdate(
    req.params.id,
    { status: parsed.data.status },
    { new: true }
  ).lean();
  if (!report) {
    throw new HttpError(404, 'Report not found');
  }
  res.json(report);
};
