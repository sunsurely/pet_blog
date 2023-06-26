const express = require('express');
const router = express.Router();

// 게시글 생성 API
// 9. 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
router.post("/posts", authMiddleware, async (req, res) => {
    // 게시글을 생성하는 사용자의 정보를 가지고 온다.
    // 10. 제목, 작성 내용을 입력하기
    const { userId } = res.locals.user;
    const { title, content, nickname } = req.body;
    const post = await Posts.create({
        UserId: userId,
        title, content, nickname
    });

    // 201 = 생성
    return res.status(201).json({ data: post });
});

module.exports = router;