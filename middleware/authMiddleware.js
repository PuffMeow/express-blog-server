// 根目录/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// 鉴权中间件
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  // 从 Authorization 头部解析 token，可以使用 Axios 的拦截器全局携带上该值
  // token 一般前面都是带 Bearer 的，然后后面接一个空格，接下来才是我们自己定义的 token 内容
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 验证 token，这个 token 密钥需要和我们登录时定义的那个一一对应上才行
  jwt.verify(token, "xxx-your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // 将用户信息存储到请求对象中，方便后续处理
    req.user = user;

    console.log('user', user)

    // 需要调用一下 next 放行到下一个处理中间件
    next();
  });
}

module.exports = authMiddleware