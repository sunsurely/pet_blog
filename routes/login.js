const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 로그인 API
router.post('/', async (req, res) => {
  const { nickname, password } = req.body;

  const user = await Users.findOne({
    where: { nickname },
  });

  // 닉네임이 다른 경우
  if (!user) {
    return res.status(404).json({ errorMessage: '닉네임을 확인해주세요.' });
  }

  // 입력한 비밀번호가, 암호화 된 비밀번호와 일치하는지 확인
  const passwordOk = await bcrypt.compare(password, user.password);
  console.log(passwordOk);

  if (!passwordOk) {
    return res
      .status(400)
      .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign({ usersId: user.usersId }, 'costomized-secret-key');
  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인에 성공하였습니다.' });
});

module.exports = router;
