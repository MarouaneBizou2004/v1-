import { Types } from 'mongoose';

import { Report } from '../models/Report.js';

export interface ReportInput {
  title: string;
  description: string;
  category: 'road' | 'lighting' | 'sanitation' | 'safety' | 'other';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images?: Types.ObjectId[];
  createdBy: string;
}

export async function createReport(input: ReportInput) {
  return Report.create({
    ...input,
    createdBy: new Types.ObjectId(input.createdBy),
    status: 'new'
  });
}

export async function listReports() {
  return Report.find().sort({ createdAt: -1 }).lean();
}

export async function getReportById(id: string) {
  return Report.findById(id).lean();
}

export async function updateReportStatus(id: string, status: 'new' | 'in_progress' | 'resolved' | 'rejected') {
  return Report.findByIdAndUpdate(id, { status }, { new: true });
}
