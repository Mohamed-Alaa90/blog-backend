import Comment from "../models/Comment.js";
import User from "../models/User.js";

import {
  commentCreateValidation,
  commentUpdateValidation,
} from "../validation/commentValidation.js";
import path from "path";
import asyncHandler from "express-async-handler";

export const createComment = asyncHandler(async (req, res) => {
  const { error } = commentCreateValidation(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
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
