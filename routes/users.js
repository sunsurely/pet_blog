const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { Profiles } = require('../models');
const loginMiddleware = require('../middleware/login-middleware');
const upload = require('../middleware/upload-middleware');

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
  const profile = await Profiles.create({ nickname });
  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

router.get('/profile', loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const profile = await Profiles.findOne({
      attribute: ['nickname', 'userComment', 'userImage'],
      where: { UserId: userId },
    });
    return res.status(200).json({ data: profile });
  } catch (err) {
    console.error(err);
  }
});

router.patch(
  '/:password/profile',
  loginMiddleware,
  upload.single('image'),
  async (req, res) => {
    const { userId } = res.locals.user;
    const { password } = req.params;
    const imageUrl = req.file.location;
    const { userContent } = req.body;
    try {
      const user = await Users.findOne({
        where: { userId },
      });

      if (password !== user.password) {
        return res
          .status(400)
          .json({ errMessage: '비밀번호가 일치하지 않습니다.' });
      }

      const profile = await Profiles.update(
        {
          imageUrl,
          userContent,
        },
        {
          where: { userId },
        },
      );

      res.status(201).json({ data: profile });
    } catch (err) {
      console.error(err);
    }
  },
);

module.exports = router;
//
