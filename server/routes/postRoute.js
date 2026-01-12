import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import photoUpload from "../middlewares/photoUpload.js";
import { createPost, getAllPosts } from "../controllers/postController.js";

const router = Router();

router
.route("/")
.post(verifyToken, photoUpload.single("image"), createPost)
.get(getAllPosts);

export default router;
