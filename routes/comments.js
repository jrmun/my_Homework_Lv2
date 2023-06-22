const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const commentList = await Comment.find({ postId: postId })
      .sort("-date")
      .exec();
    res.status(200).json({ delail: commentList });
  } catch (err) {
    console.error(err);
  }
});

router.post("/comments/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { cmtSubstance } = req.body;
  const maxcmtIdByUserId = await Comment.findOne().sort("-cmtId").exec();
  const cmtId = maxcmtIdByUserId ? maxcmtIdByUserId.cmtId + 1 : 1;
  const cmtName = res.locals.user.nickname;
  const userId = res.locals.user._id;
  if (cmtSubstance.length !== 0) {
    const createdcomment = await Comment.create({
      cmtId,
      postId,
      cmtName,
      cmtSubstance,
      userId,
    });
    res.json({ posts: createdcomment });
  } else {
    return res
      .status(400)
      .json({ success: false, errorMessage: "내용을 입력해주세요." });
  }
});

router.put("/comments/:postId/:cmtId", authMiddleware, async (req, res) => {
  const { postId, cmtId } = req.params;
  const { cmtSubstance } = req.body;
  const userId = res.locals.user._id;
  const existscomment = await Comment.find({
    postId: Number(postId),
    cmtId: Number(cmtId),
  });
  if (existscomment.length) {
    if (existscomment[0].userId === String(userId)) {
      if (cmtSubstance.length !== 0) {
        await Comment.updateOne(
          { cmtId: Number(cmtId) },
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

router.delete("/comments/:postId/:cmtId", authMiddleware, async (req, res) => {
  const { postId, cmtId } = req.params;
  const userId = res.locals.user._id;
  const existscomment = await Comment.find({
    postId: Number(postId),
    cmtId: Number(cmtId),
  });
  if (existscomment.length > 0) {
    if (existscomment[0].userId === String(userId)) {
      await Comment.deleteOne({ cmtId });
      res.json({ result: "success" });
    } else {
      res.json({ result: "false", errorMessage: "비밀번호 오류" });
    }
  }
});

module.exports = router;
