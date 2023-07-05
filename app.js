const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const tagRoutes = require("./routes/tags");
const fileRoutes = require("./routes/file");
const sequelize = require("./config/database");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// 提供静态文件访问
app.use("/tempFiles", express.static(path.join(__dirname, "tempFiles")));

// 路由
app.use("/auth", authRoutes);
app.use(authMiddleware)

app.use("/blogs", blogRoutes);
app.use("/tags", tagRoutes);
app.use("/upload", fileRoutes);

// 数据库同步
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
