const express = require("express");
const router = express.Router();
const posts = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const postList = await posts.find({ postId: postId });
    postList.sort(function (comp1, comp2) {
      let comp1date = comp1.date;
      let comp2date = comp2.date;
      if (comp1date > comp2date) {
        return -1;
      } else if (comp1date < comp2date) {
        return 1;
      }
      return 0;
    });
    res.status(200).json({ delail: postList });
  } catch (err) {
    console.error(err);
  }
});

router.post("/posts", authMiddleware, async (req, res) => {
  const { postTitle, postContent } = req.body;
  const name = res.locals.user.nickname;
  const date = new Date();
  const userId = res.locals.user._id;
  const maxpostIdByUserId = await posts.findOne().sort("-postId").exec();
  const postId = maxpostIdByUserId ? maxpostIdByUserId.postId + 1 : 1;
  const createdPost = await posts.create({
    postId,
    postTitle,
    name,
    postContent,
    date,
    userId,
  });

  res.json({ posts: createdPost });
});

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { postTitle, postContent } = req.body;
  const userId = res.locals.user._id;
  const existsPosts = await posts.find({ postId: postId });
  if (existsPosts.length) {
    if (existsPosts[0].userId === String(userId)) {
      await posts.updateOne(
        { postId: Number(postId) },
        { $set: { postTitle, postContent } }
      );
      res.json({ success: true });
    } else {
      res.json({ success: false, errorMessage: "비밀번호 오류" });
    }
  }
});

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = res.locals.user._id;
  const existsPosts = await posts.find({ postId: Number(postId) });
  if (existsPosts.length > 0) {
    if (existsPosts[0].userId === String(userId)) {
      await posts.deleteOne({ postId });
      res.json({ result: "success" });
    }
  } else {
    res.json({ result: "false", errorMessage: "비밀번호 오류" });
  }
});

module.exports = router;
