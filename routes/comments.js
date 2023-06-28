const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middleware/login-middleware.js');
const { Comments } = require("../models");

// 게시글에 대한 댓글 작성
router.post("/posts/:postId/comments", loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;
  const newComment = await Comments.create({
      PostId: postId,
      UserId: userId,
      comment,
  });

  if (comment.length === 0) {
      return res.status(403).json({
          message: "댓글 내용을 입력해주세요.",
      });
  };

  // 201 = 생성
  return res.status(201).json({ data: newComment });
});

// 댓글 수정 API
router.put("/posts/:postId/comments/:commentId", loginMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId, commentId } = req.params;
  const { comment } = req.body;

  const CommentId = await Comments.findOne({
      where: { commentId },
  });

  if (CommentId.UserId !== userId) {
      return res.status(404).json({
          message: "사용자가 일치하지 않습니다."
      });
  };
  if (comment.length === 0) {
      return res.status(403).json({
          message: "댓글 내용을 입력해주세요.",
      });
  };

  // 댓글 수정
  await Comments.update(
      { comment }, // 수정할 칼럼 및 데이터
      {
          where: {
              [Op.and]: [{ postId }, { commentId }]
          }
      },
  );

  return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

// 댓글 삭제 API
router.delete("/posts/:postId/comments/:commentId", loginMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { userId } = res.locals.user;

  const CommentId = await Comments.findOne({
      where: { commentId },
  });

  if (!CommentId) {
      return res.status(404).json({
          message: "게시글이 존재하지 않습니다.",
      })
  } else if (CommentId.UserId !== userId) {
      return res.status(403).json({
          message: "게시글 삭제 권한이 있는 사용자가 아닙니다.",
      });
  };

  // 댓글 삭제
  await Comments.destroy({
      where: {
          [Op.and]: [{ userId }, { commentId }]
      }
  });

  return res.status(200).json({ message: "게시글이 삭제되었습니다." });
});

module.exports = router;