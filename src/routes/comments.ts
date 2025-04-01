import express from "express";
import * as commentsController from "../controllers/comments";
import { ensureAuth } from "../middleware/auth";

const router = express.Router()

router.post("/createComment/:id", commentsController.createComment);


export default router;