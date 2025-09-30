import { Schema, Types, model } from 'mongoose';

export interface ChatSessionDocument {
  userId?: Types.ObjectId;
  locale: string;
  createdAt: Date;
  closedAt?: Date;
}

const chatSessionSchema = new Schema<ChatSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    locale: { type: String, default: 'en' },
    closedAt: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatSessionModel = model<ChatSessionDocument>('ChatSession', chatSessionSchema);
