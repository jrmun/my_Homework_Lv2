const mongoose = require("mongoose");

const commentSchemas = new mongoose.Schema({
  cmtId: {
    type: Number,
    required: true,
    unique: true,
  },
  postId: {
    type: String,
    unique: false,
  },
  cmtName: {
    type: String,
    required: true,
  },
  cmtSubstance: {
    type: String,
  },
  cmtDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("comment", commentSchemas);
