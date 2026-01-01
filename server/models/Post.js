import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    content: { type: String },
    title: { type: String },
    summary: { type: String },
    article_type: { type: String },
    image_url: [{ type: String }],
    post_type: {
      type: String,
      required: true,
      enum: ["text", "image", "text_with_image"],
    },
    comments: [commentSchema],
  },
  { timestamps: true, minimize: false }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
