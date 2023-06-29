// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');
// const path = require('path');

// AWS.config.update({
//   accessKeyId: 'aws엑세스키 입력하세요 꼭 삭제하고 깃헙 올리세요~',
//   sceretAccessKey: '비밀키 깃허브 올릴 때 꼭 삭제해야 됩니다',
// });

// const s3 = new AWS.S3();

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: 'uploads',
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key(req, file, cb) {
//       cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
//     },
//   }),
// });

// module.exports = upload;

//아래 코드로 교체

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'petblog',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
});

module.exports = upload;
