import { Request, Response } from "express";
import Comment, { IComment } from "../models/Comment";
import User, { IUser } from "../models/User";

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).send("Server Error");
  }
};