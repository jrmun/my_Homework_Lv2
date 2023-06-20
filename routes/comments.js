const express = require("express");
const router = express.Router();
const comment = require("../schemas/comment.js");
const authMiddleware = require("../middlewares/auth-middleware.js");
const posts = require("../schemas/post.js");

router.get("/posts/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  try {
    const commentList = await comment.find({ postId: postId });
    commentList.sort(function (comp1, comp2) {
      let comp1date = comp1.cmtDate;
      let comp2date = comp2.cmtDate;
      if (comp1date > comp2date) {
        return -1;
      } else if (comp1date < comp2date) {
        return 1;
      }
      return 0;
    });
    res.status(200).json({ delail: commentList });
  } catch (err) {
    console.error(err);
  }
});

router.post("/posts/:postId/comment", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { cmtSubstance } = req.body;
  const cmtDate = new Date();
  const maxcmtIdByUserId = await comment.findOne().sort("-cmtId").exec();
  const cmtId = maxcmtIdByUserId ? maxcmtIdByUserId.cmtId + 1 : 1;
  const post_cmtId = postId + cmtId;
  const cmtName = res.locals.user.nickname;
  const userId = res.locals.user._id;
  if (cmtSubstance.length !== 0) {
    const createdcomment = await comment.create({
      cmtId,
      postId,
      post_cmtId,
      cmtName,
      cmtSubstance,
      cmtDate,
      userId,
    });
    res.json({ posts: createdcomment });
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "내용을 입력해주세요." });
  }
});

router.put("/posts/:post_cmtId/comment/", authMiddleware, async (req, res) => {
  const { post_cmtId } = req.params;
  const { cmtSubstance } = req.body;
  const userId = res.locals.user._id;
  const existscomment = await comment.find({ post_cmtId: Number(post_cmtId) });
  if (existscomment.length) {
    if (existscomment[0].userId === String(userId)) {
      if (cmtSubstance.length !== 0) {
        await comment.updateOne(
          { post_cmtId: Number(post_cmtId) },
          { $set: { cmtSubstance } }
        );
        res.json({ success: true });
      } else {
        res.json({ success: false, errorMessage: "내용을 입력해주세요." });
      }
    } else {
      res.json({ success: false, errorMessage: "비밀번호 오류" });
    }
  }
});

router.delete(
  "/posts/:post_cmtId/comment",
  authMiddleware,
  async (req, res) => {
    const { post_cmtId } = req.params;
    const userId = res.locals.user._id;
    const existscomment = await comment.find({
      post_cmtId: Number(post_cmtId),
    });
    if (existscomment.length > 0) {
      if (existscomment[0].userId === String(userId)) {
        await comment.deleteOne({ post_cmtId });
        res.json({ result: "success" });
      } else {
        res.json({ result: "false", errorMessage: "비밀번호 오류" });
      }
    }
  }
);

module.exports = router;
