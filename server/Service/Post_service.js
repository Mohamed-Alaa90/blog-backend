const Post = require("../models/Post");

async function createPost(params) {
  try {
    const post = new Post({
      title: params.title,
      body: params.body
    });

    return await post.save();
  } catch (error) {
    throw error
  }
}

module.exports = {
  createPost
};
