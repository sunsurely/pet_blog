const express = require('express');
const router = express.Router();
const { Posts } = require('../models');
const { Users } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const multer = require('multer');
const AWS = require('aws-sdk');
const loginMiddleware = require('../middleware/login-middleware');

const upload = multer({ dest: '/' });

AWS.config.update({
  accessKeyId: 'aws엑세스키 입력하세요 꼭 삭제하고 깃헙 올리세요~',
  sceretAccessKey: '비밀키 깃허브 올릴 때 꼭 삭제해야 됩니다',
});

const s3 = new AWS.S3();

async function uploadToS3(imageFile) {
  const fileContent = fs.readFileSync(imageFile.path);
  const fileName = `${Date.now()}_${imageFile.originalname}`;
  const params = {
    Bucket: 'pet_blog',
    Key: fileName,
    Body: fileContent,
    ContentType: imageFile.mimetype,
  };
  await s3.upload(params).promise();
  const imageUrl = `https://pet_blog.s3.amazonaws.com/${fileName}`;
  return imageUrl;
}

router.get('/', async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ['postId', 'imageUrl', 'title', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({ data: posts });
});

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: [
        'imageUrl',
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

router.post('/', loginMiddleware, upload.single('image'), async (req, res) => {
  const imageFile = req.file;
  const imageUrl = await uploadToS3(imageFile);
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  const post = await Posts.create({
    imageUrl,
    UserId: userId,
    nickname: user.nickname,
    title,
    content,
  });

  return res.status(201).json({ data: post });
});

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
