const express = require("express");
const router = express.Router();
const posts = require("../schemas/post.js");

router.get("/", async (req, res) => {
  res.json("게시글 확인 : posts");
});

router.get("/posts", async (req, res) => {
  try {
    const postList = await posts.find({});
    res.status(200).json({ posts: postList });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
