import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import photoUpload from "../middlewares/photoUpload.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  toggleLikePost,
  updatePost,
  updatePostImage,
} from "../controllers/postController.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const postRouter = Router();

postRouter
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPost)
  .get(getAllPosts);
postRouter
  .route("/:id")
  .get(validateObjectId, getSinglePost)
  .delete(validateObjectId, verifyToken, deletePost)
  .put(validateObjectId, verifyToken, updatePost);
postRouter
  .route("/:id/image-upload")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updatePostImage,
  );

postRouter
  .route("/:id/toggle-like")
  .put(validateObjectId, verifyToken, toggleLikePost);
export default postRouter;
