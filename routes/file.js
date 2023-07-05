const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
// const uploadMiddleware = require("../middleware/fileMiddleware");
const ossUploadMiddleware = require("../middleware/ossMiddleware");

router.post("/file", ossUploadMiddleware, fileController.uploadFile);

module.exports = router;
