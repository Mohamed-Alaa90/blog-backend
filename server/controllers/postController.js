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
import {
  createPostValidation,
  updatePostValidation,
} from "../validation/postValidation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description create new post
 * @router /api/posts/
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
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  let result;
  try {
    result = await cloudinaryUploadImage(imagePath);
  } finally {
    fs.promises.unlink(imagePath).catch((err) => {
      console.error("Error deleting temp image file:", err);
    });
  }

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
});

/**
 * @description create new post
 * @router /api/posts/
 * @access public
 * @method GET
 */
export const getAllPosts = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { category } = req.query;
  const pageNumber = Number(req.query.pageNumber);
  let post;

  if (category && pageNumber) {
    post = await Post.find({
      category,
    })
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .populate("user", ["-password"])
      .populate("comments");
  } else if (pageNumber) {
    post = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .populate("user", ["-password"])
      .populate("comments");
  } else {
    post = await Post.find()
      .sort({
        createdAt: -1,
      })
      .populate("user", ["-password"])
      .populate("comments");
  }
  res.status(200).json(post);
});

/**
 * @description get Single Post
 * @router /api/posts/:id
 * @access public
 * @method GET
 */
export const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }
  res.status(200).json(post);
});

/**
 * @description delete Post
 * @router /api/posts/:id
 * @access private (only admin or post owner)
 * @method DELETE
 */

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (!req.user.isAdmin && post.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied, forbidden",
    });
  }
  await Post.findByIdAndDelete(req.params.id);

  if (post.image?.publicId) {
    await cloudinaryRemoveImage(post.image.publicId);
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

/**
 * @description update Post
 * @router /api/posts/:id
 * @access private (only admin or post owner)
 * @method PUT
 */

export const updatePost = asyncHandler(async (req, res) => {
  const { error } = updatePostValidation(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/\"/g, ""),
    });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }
  if (!req.user.isAdmin && post.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied, forbidden",
    });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true },
  ).populate("user", ["-password"]);

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post: updatedPost,
  });
});

/**
 * @description update photo of post
 * @router /api/posts/upload-image/:id
 * @access private (only admin or post owner)
 * @method PUT
 */
export const updatePostImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "image is required",
    });
  }
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (!req.user.isAdmin && post.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied, forbidden",
    });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  let uploadResult;
  try {
    uploadResult = await cloudinaryUploadImage(imagePath);
  } finally {
    fs.promises.unlink(imagePath).catch((err) => {
      console.error("Error deleting temp image file:", err);
    });
  }

  const oldImagePublicId = post.image?.publicId;
  const imagePost = await Post.findByIdAndUpdate(
    req.params.id,

    {
      $set: {
        image: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
    },
    { new: true },
  );

  if (oldImagePublicId) {
    await cloudinaryRemoveImage(oldImagePublicId);
  }

  res.status(200).json({
    success: true,
    message: "post image updated successfully",
    post: imagePost,
  });
});

export const toggleLikePost = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user.id;
  const { id: postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === loggedInUserId,
  );

  const updatePost = await Post.findByIdAndUpdate(
    postId,
    isPostAlreadyLiked
      ? {
          $pull: { likes: loggedInUserId },
        }
      : {
          $addToSet: { likes: loggedInUserId },
        },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: isPostAlreadyLiked ? "remove like" : "add like",
    updatePost,
  });
});
