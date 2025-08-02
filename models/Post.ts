import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IntPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const PostSchema = new Schema<IntPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Post = models.Post || model<IntPost>('Post', PostSchema);
