import { Schema, model } from 'mongoose';

export type UserRole = 'citizen' | 'staff' | 'admin';

export interface UserDocument {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['citizen', 'staff', 'admin'], default: 'citizen' },
    passwordHash: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = model<UserDocument>('User', userSchema);
