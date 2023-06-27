const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 작성 API
router.post("/posts/:postId/comment", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { title, content, nickname } = req.body;
    const post = await Posts.create({
        UserId: userId,
        title, content, nickname
    });

    return res.status(201).json({ message: "게시글이 수정되었습니다." });
});

// 댓글 목록 조회 API
router.get("/posts/:postId/comment", async (req, res) => {
    const posts = await Posts.findAll({
        attributes: ['userId','postId', 'title', 'nickname', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
});

module.exports = router;