const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.find({ postId: postId });
    res.status(200).json({ delail: post });
  } catch (err) {
    console.error(err);
  }
});

router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { postTitle, postContent } = req.body;
    const name = res.locals.user.nickname;
    const userId = res.locals.user._id;
    const maxpostIdByUserId = await Post.findOne().sort("-postId").exec();
    const postId = maxpostIdByUserId ? maxpostIdByUserId.postId + 1 : 1;
    const createdPost = await Post.create({
      postId,
      postTitle,
      name,
      postContent,
      userId,
    });
    res.json({ posts: createdPost });
  } catch {
    res.json({ result: "false", errorMessage: "제목과 내용을 입력해주세요." });
  }
});

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { postTitle, postContent } = req.body;
  const userId = res.locals.user._id;
  const existsPosts = await Post.find({ postId: postId });
  if (existsPosts.length) {
    if (existsPosts[0].userId === String(userId)) {
      await posts.updateOne(
        { postId: Number(postId) },
        { $set: { postTitle, postContent } }
      );
      res.json({ success: true });
    } else {
      res.json({ success: false, errorMessage: "아이디 정보가 다릅니다." });
    }
  }
});

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = res.locals.user._id;
  const existsPosts = await Post.find({ postId: Number(postId) });
  if (existsPosts.length > 0) {
    if (existsPosts[0].userId === String(userId)) {
      await posts.deleteOne({ postId });
      res.json({ result: "success" });
    }
  } else {
    res.json({ result: "false", errorMessage: "아이디 정보가 다릅니다." });
  }
});

module.exports = router;
