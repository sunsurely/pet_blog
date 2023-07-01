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
  return res.status(200).json({ message: '로그인에 성공하였습니다.' });
});

// 로그아웃 API
router.post('/logout', (req, res) => {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      return res.status(401).json({ errorMessage: '로그인상태가 아닙니다.' });
    }

    res.clearCookie('authorization').status(200).json({
      message: '로그아웃이 완료되었습니다.',
    });

    // 로그아웃하고 홈페이지로 이동하는 코드인데 이건 확인을 어떻게 해야될지 몰라서 확인을 못했습니다.
    // 프론트연결후 확인 해봐야될 것 같습니당.
    // 로그아웃누르면 errorMessage 뜨는거 맞습니다.
    // 연결까지 해보고 정상작동하는지를 확인 해야 될 듯 합니다.
    res.redirect('/');
  } catch (err) {
    res.status(404).json({ errorMessage: '로그아웃에 실패했습니다.' });
  }
});

module.exports = router;
