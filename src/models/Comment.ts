import mongoose, { Document, Schema, Model } from "mongoose";

export interface IComment extends Document {
  comment: string;
  likes: number;
  post: mongoose.Types.ObjectId;
  createdBy: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;