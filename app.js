const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const indexRouter = require("./routes/index.js");
const postsRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comments.js");
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");

const connect = require("./schemas/index.js");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  "/api",
  indexRouter,
  postsRouter,
  commentRouter,
  userRouter,
  authRouter
);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
