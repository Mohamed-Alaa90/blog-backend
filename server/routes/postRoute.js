import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import photoUpload from "../middlewares/photoUpload.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
  updatePostImage,
} from "../controllers/postController.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPost)
  .get(getAllPosts);
router
  .route("/:id")
  .get(validateObjectId, getSinglePost)
  .delete(validateObjectId, verifyToken, deletePost)
  .put(validateObjectId, verifyToken, updatePost);
router
  .route("/:id/image-upload")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updatePostImage,
  );
export default router;
