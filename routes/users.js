const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const loginMiddleware = require('../middleware/login-middleware.js');

const bcrypt = require('bcrypt');
const saltRounds = 15;

// 내 정보 조회 API
router.get('/me', loginMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;

  res.status(200).json({
    user: {
      nickname: nickname,
    },
  });
});

// 회원가입 API
router.post('/', async (req, res) => {
  const { nickname, password, confirm } = req.body;
  const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{3,}$/;
  if (!nickname || !pattern.test(nickname)) {
    return res
      .status(412)
      .json({ errorMessage: '닉네임의 형식이 일치하지 않습니다.' });
  }

  if (password.length < 4 || password.includes(nickname)) {
    return res
      .status(412)
      .json({ errorMessage: '비밀번호의 형식이 일치하지 않습니다.' });
  }
  if (password !== confirm) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드가 일치하지 않습니다.' });
  }

  const isExistUser = await Users.findOne({
    where: { nickname },
  });
  if (isExistUser) {
    return res
      .status(412)
      .json({ errorMessage: '이미 존재하는 사용자입니다.' });
  }

  // 비밀번호 암호화 처리
  const encrypted = await bcrypt.hash(password, saltRounds);

  const user = await Users.create({
    nickname,
    password: encrypted, // 암호화 된 비밀번호를 저장
  });

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

module.exports = router;
