import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  image: string;
  cloudinaryId: string;
  caption: string;
  likes: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema: Schema<IPost> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
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

const Post: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);
export default Post;