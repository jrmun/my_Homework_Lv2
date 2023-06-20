const mongoose = require("mongoose");

const commentSchemas = new mongoose.Schema({
  cmtId: {
    type: Number,
    required: true,
    unique: true,
  },
  postId: {
    type: Number,
    required: true,
  },
  cmtName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cmtSubstance: {
    type: String,
  },
  cmtDate: {
    type: Date,
  },
});

module.exports = mongoose.model("comment", commentSchemas);
