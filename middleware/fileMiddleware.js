const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempFolderPath = path.join(__dirname, "../tempFiles");
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath);
    }
    cb(null, tempFolderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
    cb(null, filename);
  },
});

// 文件上传中间件
const upload = multer({ storage });
const uploadMiddleware = upload.single("file");

module.exports = uploadMiddleware
