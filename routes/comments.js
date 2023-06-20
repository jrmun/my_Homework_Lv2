const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const posts = require("../schemas/post.js");
const comment = require("../schemas/comment.js");

const salt = crypto.randomBytes(32).toString("base64");

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

router.post("/posts/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  const { cmtId, cmtName, password: pas, cmtSubstance } = req.body;
  cmtId = String(postId) + String(cmtId);
  const cmtDate = new Date();

  const password = crypto
    .pbkdf2Sync(pas, salt, 1, 32, "sha512")
    .toString("base64");

  const existscomment = await comment.find({ cmtId: Number(cmtId) });
  if (existscomment.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 존재하는 commentId입니다." });
  } else {
    if (cmtSubstance.length !== 0) {
      const createdcomment = await comment.create({
        cmtId,
        postId,
        cmtName,
        password,
        cmtSubstance,
        cmtDate,
      });
      res.json({ posts: createdcomment });
    } else {
      return res
        .status(400)
        .json({ success: false, errorMessage: "내용을 입력해주세요." });
    }
  }
});

router.put("/posts/:cmtId/comment/", async (req, res) => {
  const { cmtId } = req.params;
  const { cmtSubstance, password: pas } = req.body;
  const password = crypto
    .pbkdf2Sync(pas, salt, 1, 32, "sha512")
    .toString("base64");
  const existscomment = await comment.find({ cmtId: Number(cmtId) });
  if (existscomment.length) {
    if (existscomment[0].password === password) {
      if (cmtSubstance.length !== 0) {
        await comment.updateOne(
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

router.delete("/posts/:cmtId/comment", async (req, res) => {
  const { cmtId } = req.params;
  const { password: pas } = req.body;

  const password = crypto
    .pbkdf2Sync(pas, salt, 1, 32, "sha512")
    .toString("base64");

  const existscomment = await comment.find({ cmtId: Number(cmtId) });
  if (existscomment.length > 0) {
    if (existscomment[0].password === password) {
      await comment.deleteOne({ cmtId });
      res.json({ result: "success" });
    } else {
      res.json({ result: "false", errorMessage: "비밀번호 오류" });
    }
  }
});

module.exports = router;
