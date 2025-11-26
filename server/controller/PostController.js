const { models } = require("mongoose");
const { createPost } = require("../Service/Post_service");

async function createPostController(req, res) {
  try {
    const post = createPost(req.body);
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
}

module.exports = {
  createPostController
}
