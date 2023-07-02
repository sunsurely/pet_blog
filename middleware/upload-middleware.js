const multer = require('multer');
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
    bucket: 'pet-blog',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (file.fieldname !== 'image') {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const singleUpload = (fieldName) => {
  return function (req, res, next) {
    upload.single(fieldName)(req, res, function (err) {
      if (
        err instanceof multer.MulterError &&
        err.code === 'LIMIT_UNEXPECTED_FILE'
      ) {
        // 이미지 필드가 누락된 경우 기본값을 설정
        req.file = null;
        next();
      } else if (err) {
        next(err);
      } else {
        next();
      }
    });
  };
};

module.exports = upload;
