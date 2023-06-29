const express = require('express');
const router = express.Router();
const { Users } = require('../models');

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
      .json({ errorMessage: '패스워드가 패스워드 확인과 다릅니다.' });
  }

  const isExistUser = await Users.findOne({
    where: { nickname },
  });
  if (isExistUser) {
    return res
      .status(412)
      .json({ errorMessage: '이미 존재하는 이용자입니다.' });
  }

  const user = await Users.create({ nickname, password });

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

module.exports = router;
//
