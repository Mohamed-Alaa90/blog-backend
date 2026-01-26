import { Router } from "express";
import {
  deleteUserProfile,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  uploadUserPhoto,
} from "../controllers/userController.js";
import {
  verifyToken,
  verifyTokenAdminAndOnlyUser,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import photoUpload from "../middlewares/photoUpload.js";

const userRouter = Router();

userRouter.route("/profile").get(verifyTokenAndAdmin, getAllUsers);

userRouter
  .route("/profile/:id")
  .get(validateObjectId, getUserProfile)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile)
  .delete(validateObjectId, verifyTokenAdminAndOnlyUser, deleteUserProfile);

userRouter
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), uploadUserPhoto);

export default userRouter;
