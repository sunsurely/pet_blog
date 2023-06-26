const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 작성
router.post("/posts/:postId/comment", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { title, content, nickname } = req.body;
    const post = await Posts.create({
        UserId: userId,
        title, content, nickname
    });

    return res.status(201).json({ data: post });
});

module.exports = router;