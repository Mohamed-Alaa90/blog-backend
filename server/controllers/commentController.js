import Comment from "../models/Comment.js";
import {
  commentCreateValidation,
  commentUpdateValidation,
} from "../validation/commentValidation.js";
import path from "path";
import asyncHandler from "express-async-handler";

export const addComment = asyncHandler(async (req, res) => {});
