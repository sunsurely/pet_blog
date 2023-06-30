const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { Posts } = require('../models');
const { Op } = require('sequelize');
const loginMiddleware = require('../middleware/login-middleware');
const upload = require('../middleware/upload-middleware');

// 게시글 조회 API
router.get('/', async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ['postId', 'postImage', 'title', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({ data: posts });
});

// 게시글 상세 조회 API
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: [
        'postImage',
        'postId',
        'title',
        'nickname',
        'content',
        'createdAt',
        'updatedAt',
      ],
      where: { postId },
    });
    return res.status(200).json({ data: post });
  } catch (err) {
    console.log(err);
  }
});



router.post(
  '/posts',
  loginMiddleware,
  upload.single('image'),
  async (req, res) => {
    const imageUrl = req.file.location;
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    const user = await Users.findOne({
      where: { userId },
    });
    const post = await Posts.create({
      postImage: imageUrl, // 데이타베이스 postImage 항목 추가로  이름 변경
      UserId: userId,
      nickname: user.nickname,
      title,
      content,
    });


    return res.status(201).json({ data: post });
  },
);


// 게시글 수정 API
router.put('/:postId', loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await Posts.findOne({
    where: { [Op.and]: [{ postId }, { userId }] },
  });

  if (!post) {
    return res
      .status(400)
      .json({ errorMessage: '게시물을 수정할 수 없습니다.' });
  }

  await Posts.update(
    { title, content },
    {
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
    },
  );

  res.status(201).json({ message: '게시물을 수정했습니다.' });
});

// 게시글 삭제 API
router.delete('/:postId', loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const post = await Posts.findOne({
    where: { [Op.and]: [{ postId }, { userId }] },
  });

  if (!post) {
    return res.status(400).json({
      sucess: false,
      errorMessage: '게시글의 삭제 권한이 존재하지 않습니다.',
    });
  }
  await Posts.destroy({ where: { postId } });

  res.status(200).json({ message: '게시글을 삭제했습니다.' });
});

module.exports = router;
