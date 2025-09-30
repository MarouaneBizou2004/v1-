import { Schema, Types, model } from 'mongoose';

type Sender = 'user' | 'bot' | 'staff';

export interface MessageDocument {
  sessionId: Types.ObjectId;
  sender: Sender;
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

export const MessageModel = model<MessageDocument>('Message', messageSchema);
