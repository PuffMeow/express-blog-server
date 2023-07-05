const multer = require("multer");
const MAO = require("multer-aliyun-oss");

const upload = multer({
  storage: MAO({
    config: {
      region: "xxx",
      accessKeyId: "xxx",
      accessKeySecret: "xxx",
      bucket: "xxx",
    },
  }),
  // oss 中存放文件的文件夹
  destination: "public/images",
});

const ossMiddleware = upload.single('file')

module.exports = ossMiddleware;
