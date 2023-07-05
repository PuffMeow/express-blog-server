// routes/blogs.js

const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

// 创建博客
router.post("/create", blogController.createBlog);
// 查询博客列表
router.get("/query", blogController.getBlogList);
// 根据 id 查询博客详情
router.get("/query/:id", blogController.getBlogById);
// 根据 id 修改博客
router.patch("/update/:id", blogController.updateBlog);
// 根据 id 删除博客
router.delete("/delete/:id", blogController.deleteBlog);
// 根据标签id查找对应的博客
router.get("/queryByTag/:tagId", blogController.queryByTag);

module.exports = router;
