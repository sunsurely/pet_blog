const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const loginMiddleware = async (req, res, next) => {
  const { authorization } = req.cookies;
  const [authType, authToken] = (authorization ?? '').split(' ');

  if (!authorization) {
    return res.status(403).json({ errorMessage: '토큰이 존재하지 않습니다.' });
  }

  if (authType !== 'Bearer' || !authToken) {
    return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다' });
  }

  try {
    const { usersId } = jwt.verify(authToken, 'costomized-secret-key');

    const user = await Users.findOne({
      where: usersId,
    });
    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: '잘못된 접근입니다.' });
  }
};

module.exports = loginMiddleware;
