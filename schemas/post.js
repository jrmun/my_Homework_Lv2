const mongoose = require("mongoose");

const postsSchemas = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  postContent: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("posts", postsSchemas);
