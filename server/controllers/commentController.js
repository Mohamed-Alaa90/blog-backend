import Comment from "../models/Comment.js";
import User from "../models/User.js";

import {
  commentCreateValidation,
  commentUpdateValidation,
} from "../validation/commentValidation.js";
import path from "path";
import asyncHandler from "express-async-handler";

/**
 * @description Create a new comment
 * @router /api/comment/
 * @access private (Only user logged in)
 * @method POST
 */
export const createComment = asyncHandler(async (req, res) => {
  const { error } = commentCreateValidation(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/\"/g, ""),
    });
  }

  const profile = await User.findById(req.user.id);

  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });

  res.status(201).json({
    success: true,
    comment,
  });
});

/**
 * @description get All comments
 * @router /api/comment/
 * @access private Admin
 * @method GET
 */

export const getAllComments = asyncHandler(async (req, res) => {
  const comment = await Comment.find()
    .sort({ createdAt: -1 })
    .populate("user", ["-password"]);
  res.status(200).json({
    success: true,
    comment,
  });
});

/**
 * @description delete comment
 * @router /api/comment/:id
 * @access private Admin
 * @method DELETE
 */

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment Not Found",
    });
  }

  if (!req.user.isAdmin && comment.user.id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied, forbidden",
    });
  }
  await Comment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Comment Deleted success",
  });
});
/**
 * @description Update comment
 * @router /api/comment/:id
 * @access private Admin
 * @method PUT
 */
export const updateComment = asyncHandler(async (req, res) => {
  const { error } = commentUpdateValidation(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/\"/g, ""),
    });
  }

  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment Not Found",
    });
  }

  if (!req.user.isAdmin && comment.user.id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied, forbidden",
    });
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true },
  );

  res.status(200).json({
    success: true,
    comment: updatedComment,
  });
});
