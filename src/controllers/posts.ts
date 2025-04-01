import { Request, Response } from "express";
import cloudinary from "../middleware/cloudinary";
import Post, { IPost } from "../models/Post";
import User, { IUser } from "../models/User";
import Comment, { IComment } from "../models/Comment";
import { cp } from "fs";

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
      return;
    }
    const posts = await Post.find({ user: req.user.id }).lean();
    res.render("profile.ejs", { posts: posts, user: req.user });
  } catch (err) {
    console.error(err);
  }
};

export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().sort({ createdAt: "desc" }).lean();
    res.render("feed.ejs", { posts: posts });
  } catch (err) {
    console.error(err);
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).lean();
    const comments = await Comment.find({post: req.params.id})
    res.render("post.ejs", { post: post, user: req.user, comments: comments});
  } catch (err) {
    console.error(err);
  }
};

export const createPost = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await Post.create({
      title: req.body.title,
      image: result.secure_url,
      cloudinaryId: result.public_id,
      caption: req.body.caption,
      likes: 0,
      user: req.user.id,
    });
    console.log("Post has been added!");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  console.log("Like post request received");
  console.log("Like post request received");
  try {
    await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
      }
    );
    console.log("Likes +1");
    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.error(err);
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log("Post not found");
      return res.redirect("/profile");
    }
    await cloudinary.uploader.destroy(post.cloudinaryId);
    
    await Post.deleteOne({ _id: req.params.id });
    console.log("Deleted Post");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.redirect("/profile");
  }
};