import express from "express";
import upload from "../middleware/multer";
import * as postsController from "../controllers/posts";
import { ensureAuth } from "../middleware/auth";

const router = express.Router();

// post routes
router.get("/:id", ensureAuth, postsController.getPost);
router.post("/createPost", ensureAuth, upload.single("file"), postsController.createPost);
router.put("/likePost/:id", ensureAuth, postsController.likePost);
router.delete("/deletePost/:id", ensureAuth, postsController.deletePost);

export default router;