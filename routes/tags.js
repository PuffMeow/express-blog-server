// routes/tags.js

const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// 创建标签
router.post("/create", tagController.createTag);
// 查询所有标签
router.get("/query", tagController.getTags);
// 根据 id 删除标签
router.delete("/delete/:id", tagController.deleteTag);

module.exports = router;
