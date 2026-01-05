import { Router } from "express";
import {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  uploadUserPhoto,
} from "../controllers/userController.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import photoUpload from "../middlewares/photoUpload.js";
const router = Router();

router.route("/profile").get(verifyTokenAndAdmin, getAllUsers);

router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfile)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile);

router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), uploadUserPhoto);

export default router;
