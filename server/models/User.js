import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlenght: 8,
    },
    bio: {
      type: String,
      default: "Welcome ",
    },
    profile_picture: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2016/11/08/15/21/user-1808597_1280.png",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SEC,

    {
      expiresIn: "7d",
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
