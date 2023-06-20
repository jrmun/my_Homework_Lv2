const express = require("express");
const router = express.Router();
const posts = require("../schemas/post.js");

router.get("/", async (req, res) => {
  res.json("게시글 확인 : posts");
});

router.get("/posts", async (req, res) => {
  try {
    const postList = await posts.find();

    const newpostList = postList.map((post) => {
      return { postTitle: post.postTitle, name: post.name, date: post.date };
    });
    newpostList.sort(function (comp1, comp2) {
      let comp1date = comp1.cmtDate;
      let comp2date = comp2.cmtDate;
      if (comp1date > comp2date) {
        return -1;
      } else if (comp1date < comp2date) {
        return 1;
      }
      return 0;
    });
    res.status(200).json({ posts: newpostList });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
