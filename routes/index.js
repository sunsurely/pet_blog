const express = require('express');
const router = express.Router();
const postsRouter = require('./posts');
const userRouter = require('./users');
const loginRouter = require('./login');
const commentsRouter = require('./comments');

const defaultRoutes = [
  {
    path: '/posts',
    route: postsRouter,
  },
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/login',
    route: loginRouter,
  },
  {
    path: '/comments',
    route: commentsRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
