const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { username, password, nickname } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    // 对密码进行加密处理
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    await User.create({ username, password: hashedPassword, nickname });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ msg: "Failed to register user" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // 检查用户名是否存在
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    // 检查密码是否匹配
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    // 更新用户的最后在线时间
    user.lastOnlineTime = new Date();
    await user.save();

    // 创建访问令牌
    const token = jwt.sign({ userId: user.id }, "xxx-your-secret-key", {
      expiresIn: "24h",
    });

    // 返回包含令牌、账号名和用户名的响应
    res.json({ token, account: user.username, nickname: user.nickname, userId: user.id});
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ msg: "Failed to log in" });
  }
}

module.exports = { register, login };
