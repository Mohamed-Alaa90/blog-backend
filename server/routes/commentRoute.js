import { validateObjectId } from "../middlewares/validateObjectId.js";
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createComment } from "../controllers/commentController.js";
const router = Router();

router.route("/").post(verifyToken, createComment);

export default router;
