import express from "express";
import * as authController from "../controllers/auth";
import * as homeController from "../controllers/home";
import * as postsController from "../controllers/posts";
import { ensureAuth, ensureGuest } from "../middleware/auth";

const router = express.Router();

router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

export default router;