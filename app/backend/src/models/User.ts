import { Schema, model } from 'mongoose';

export interface UserDocument {
  name: string;
  email: string;
  role: 'citizen' | 'staff' | 'admin';
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['citizen', 'staff', 'admin'], default: 'citizen' },
    passwordHash: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UserModel = model<UserDocument>('User', userSchema);
