import path from "path";
import asyncHandler from "express-async-handler";
import {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} from "../config/cloudinary.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import Post from "../models/Post.js";
import { createPostValidation } from "../validation/postValidation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description create new post
 * @router /api/posts/ create post
 * @access private (Only user logged in)
 * @method POST
 */

export const createPost = asyncHandler(async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      success: false,
      message: "Image is required",
    });

  const { error } = createPostValidation(req.body);

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  const result = await cloudinaryUploadImage(imagePath);

  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      publicId: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
  fs.unlinkSync(imagePath);
});
export const getAllPosts = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let post;

  if (pageNumber) {
    post = await Post.find().skip((pageNumber - 1) * POST_PER_PAGE).limit(POST_PER_PAGE)
  } else if (category) {
    post = await Post.find({ category });
  } else {
    post = await Post.find()
  }
  res.status(200).json(post)

})