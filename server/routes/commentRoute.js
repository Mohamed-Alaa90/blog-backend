import { validateObjectId } from "../middlewares/validateObjectId.js";
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();

export default router;
