import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { validateUpdateUser } from "../validation/userValidation.js";
import bcrypt from "bcryptjs";
import path from "path";
import {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} from "../config/cloudinary.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description Get All Users Profile
 * @router /api/users/profile
 * @access private (Only Admin)
 * @method GET
 */

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});

/**
 * @description Get Single Users Profile
 * @router /api/users/profile/:id
 * @access public
 * @method GET
 */

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @description Update Users Profile
 * @router /api/users/profile/:id
 * @access public
 * @method PUT
 */

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/\"/g, ""),
    });
  }

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  const userUpdate = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");
  res.status(200).json({
    success: true,
    userUpdate,
  });
});

/**
 * @description Upload Users Profile Photo
 * @router /api/users/profile/profile-photo-upload
 * @access public
 * @method POST
 */

export const uploadUserPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please Upload a Photo",
    });
  }
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  const result = await cloudinaryUploadImage(imagePath);

  const user = await User.findById(req.user.id);
  if (user.profile_picture.publicId !== null) {
    await cloudinaryRemoveImage(user.profile_picture.publicId);
  }
  user.profile_picture = {
    publicId: result.public_id,
    url: result.secure_url,
  };
  await user.save();
  res.status(200).json({
    success: true,
    message: "User Photo Uploaded Successfully",
    data: {
      publicId: result.public_id,
      url: result.secure_url,
    },
  });

  fs.unlinkSync(imagePath);
});
