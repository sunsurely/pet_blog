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

  // jwt 생성
  const token = jwt.sign({ userId: user.userId }, 'costomized-secret-key', {
    expiresIn: '1h',
  }); // 1시간후 토큰 자동 만료
  res.cookie('authorization', `Bearer ${token}`);

  // setTimeout(() => {
  //   res.clearCookie('authorization');
  //   return res.status(201).redirect('/');
  // }, 1000);

  return res.status(201).json({});
});

// 로그아웃 API
router.post('/logout', (req, res) => {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      return res.status(401).json({ errorMessage: '로그인상태가 아닙니다.' });
    }

    res.clearCookie('authorization');

    return res.redirect('/');
  } catch (err) {
    res.status(404).json({ errorMessage: '로그아웃에 실패했습니다.' });
  }
});

module.exports = router;
