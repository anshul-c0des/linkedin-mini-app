import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IntUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  bio?: string;
}

const UserSchema = new Schema<IntUser>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
});

export const User = models.User || model<IntUser>('User', UserSchema);
