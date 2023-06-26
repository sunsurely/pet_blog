const express = require('express');
const router = express.Router();
const { Posts } = require('../models');
const { Users } = require('../models');
const loginMiddleware = require('../middleware/login-middleware');

router.get('/', async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ['postId', 'title', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({ data: posts });
});

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: [
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

router.post('/', loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  const post = await Posts.create({
    UsersId: userId,
    nickname: user.nickname,
    title,
    content,
  });

  return res.status(201).json({ data: post });
});

module.exports = router;
