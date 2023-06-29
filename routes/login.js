const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { nickname, password } = req.body;

  const user = await Users.findOne({
    where: { nickname },
  });

  if (!user || password !== user.password) {
    return res
      .status(400)
      .json({ errorMessage: '닉네임 또는 패스워드를 확인해주세요' });
  }

  const token = jwt.sign({ usersId: user.usersId }, 'costomized-secret-key');
  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인에 성공하였습니다.' });
});

module.exports = router;
