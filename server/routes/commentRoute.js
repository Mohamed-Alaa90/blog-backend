import { validateObjectId } from "../middlewares/validateObjectId.js";
import { Router } from "express";
import {
  verifyToken,
  verifyTokenAdminAndOnlyUser,
  verifyTokenAndAdmin,
} from "../middlewares/auth.js";
import {
  createComment,
  getAllComments,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
const commentRoute = Router();

commentRoute
  .route("/")
  .post(verifyToken, createComment)
  .get(verifyTokenAndAdmin, getAllComments);

commentRoute
  .route("/:id")
  .delete(validateObjectId, verifyTokenAdminAndOnlyUser, deleteComment)
  .put(validateObjectId, verifyTokenAdminAndOnlyUser, updateComment);

export default commentRoute;
