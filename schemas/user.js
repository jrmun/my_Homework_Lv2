const mongoose = require("mongoose");

const userSchemas = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchemas.virtual("userId").get(function () {
  return this._id.toHexString();
});

userSchemas.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("user", userSchemas);
