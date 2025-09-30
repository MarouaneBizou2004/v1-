import { Schema, Types, model } from 'mongoose';

export type MessageSender = 'user' | 'bot' | 'staff';

export interface MessageDocument {
  sessionId: Types.ObjectId;
  sender: MessageSender;
  text: string;
  attachments: Types.ObjectId[];
  nlu?: {
    intent?: string;
    entities?: Record<string, unknown>;
  };
  createdAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    sender: { type: String, enum: ['user', 'bot', 'staff'], required: true },
    text: { type: String, required: true },
    attachments: [{ type: Schema.Types.ObjectId }],
    nlu: {
      intent: { type: String },
      entities: { type: Schema.Types.Mixed }
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message = model<MessageDocument>('Message', messageSchema);
