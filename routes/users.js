const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");

router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  const regExp1 = /^[a-zA-z0-9]{3,12}$/;
  const regExp2 =
    /^[A-Za-z0-9`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?]{4,16}$/;
  if (!regExp1.test(nickname)) {
    res.status(400).json({
      errorMessage: "닉네임은 영문 대소문자와 숫자 3~12자리로 입력해주세요.",
    });
    return;
  }

  if (!regExp2.test(password) || password.includes(nickname)) {
    res.status(400).json({
      errorMessage: "비밀번호 오류",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  const existsUsers = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existsUsers) {
    res.status(400).json({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).json({});
});

module.exports = router;
