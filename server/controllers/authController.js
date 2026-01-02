import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import {
  loginValidation,
  registerValidation,
} from "../validation/authValidation.js";

/**
 * @description Register new User
 * @router /api/auth/register
 * @access public
 * @method POST
 */
export const register = asyncHandler(async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/\"/g, ""),
    });
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(409).json({
      success: false,
      message: "Email Already Exist",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: "User Register Successfully Pleas login",
  });
});

/**
 * @description login User
 * @router /api/auth/login
 * @access public
 * @method POST
 */
export const login = asyncHandler(async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/\"/g, ""),
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email Or Password",
    });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email Or Password",
    });
  }

  const token = user.generateAuthToken();

  const dataResponse = {
    id: user._id,
    name: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    profile_picture: user.profile_picture,
    token,
  };

  res.status(200).json({
    success: true,
    message: "Login Successfully",
    data: dataResponse,
  });
});
