const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { Profiles } = require('../models');
const loginMiddleware = require('../middleware/login-middleware');
const upload = require('../middleware/upload-middleware');

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
  console.log(password);
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

  await Profiles.create({
    //회원 가입 시 프로필에 유저ID와 닉네임 저장
    UserId: user.userId,
    Nickname: user.nickname,
  });

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

//프로필 조회
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

// 프로필 수정 API
router.patch(
  '/profile',
  loginMiddleware,
  upload.single('image'),
  async (req, res) => {
    const User = res.locals.user;
    const { password } = req.body;
    const userImage = req.file.location;
    const { userComment } = req.body; //userContent에서 userComment 로 변경
    const isPasswordMatch = await bcrypt.compare(password, User.password);

    try {
      if (isPasswordMatch !== true) {
        return res
          .status(400)
          .json({ errMessage: '비밀번호가 일치하지 않습니다.' });
      }

      const profile = await Profiles.update(
        {
          userImage: userImage,
          userComment, //userContent에서 userComment 로 변경
        },
        {
          where: { UserId: User.userId },
        },
      );

      res.status(201).json({ data: profile });
    } catch (err) {
      console.error(err);
    }
  },
);

module.exports = router;
