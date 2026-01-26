import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});
const Post = mongoose.model("Post", postSchema);

export default Post;
