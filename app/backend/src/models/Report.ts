import { Schema, Types, model } from 'mongoose';

type Category = 'road' | 'lighting' | 'sanitation' | 'safety' | 'other';
type Status = 'new' | 'in_progress' | 'resolved' | 'rejected';

export interface ReportDocument {
  title: string;
  description: string;
  category: Category;
  status: Status;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['road', 'lighting', 'sanitation', 'safety', 'other'], required: true },
    status: { type: String, enum: ['new', 'in_progress', 'resolved', 'rejected'], default: 'new' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String }
    },
    images: [{ type: Schema.Types.ObjectId }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const ReportModel = model<ReportDocument>('Report', reportSchema);
