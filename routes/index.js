const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");

router.get("/", async (req, res) => {
  res.json("게시글 확인 : posts");
});

router.get("/posts", async (req, res) => {
  try {
    const postList = await Post.find().sort("-date").exec();
    const newpostList = postList.map((post) => {
      return { postTitle: post.postTitle, name: post.name, date: post.date };
    });
    res.status(200).json({ posts: newpostList });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
