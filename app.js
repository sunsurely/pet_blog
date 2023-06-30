const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

sequelize.sync({ force: false }).then(() => {
  console.log('데이터베이스 연결 성공');
});

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', routes);
app.use(express.static('public'));

app.listen(port, () => {
  console.log(port, '포트로 서버가 대기 중입니다.');
});
