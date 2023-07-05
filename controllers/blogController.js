const Blog = require("../models/Blog");
const Tag = require("../models/Tag");
const User = require("../models/User");

async function createBlog(req, res) {
  try {
    const { title, content, coverImage, tags } = req.body;

    // 查询标签是否存在
    const existingTags = await Tag.findAll({
      where: { name: tags },
    });

    if (existingTags.length === 0) {
      return res.status(404).json({ error: "Tags not found" });
    }

    // 创建博客记录
    const newBlog = await Blog.create({
      title,
      content,
      coverImage,
      // 在鉴权中间件中我们挂载了用户信息在 req 中
      userId: req.user.userId,
      isDeleted: false,
    });

    // 关联标签和博客
    await newBlog.setTags(existingTags);

    // 返回创建的博客记录
    res.json(newBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBlogList(req, res) {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const _page = parseInt(page);
    const _pageSize = parseInt(pageSize);

    // 查询所有博客并返回数量
    const blogs = await Blog.findAndCountAll({
      offset: (_page - 1) * _pageSize,
      limit: _pageSize,
      where: { isDeleted: false },
      distinct: true,
      attributes: {
        exclude: ["isDeleted"],
      },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: {
            exclude: ["isDeleted", "createdAt", "updatedAt"],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "user",
          attributes: ["nickname", "id"],
        },
      ],
    });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBlogById(req, res) {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      where: { id, isDeleted: false },
      attributes: {
        exclude: ["isDeleted"],
      },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: {
            exclude: ["isDeleted", "createdAt", "updatedAt"],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "user",
          attributes: ["nickname", "id"],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, content, coverImage, tags } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // 更新博客记录
    blog.title = title;
    blog.content = content;
    blog.coverImage = coverImage;
    // 在鉴权中间件中我们挂载了用户信息在 req 中
    blog.userId = req.user.userId;
    blog.updatedAt = +new Date();
    await blog.save();

    // 更新关联的标签
    const existingTags = await Tag.findAll({
      where: { name: tags },
    });

    if (existingTags.length === 0) {
      return res.status(404).json({ error: "Tags not found" });
    }

    await blog.setTags(existingTags);

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // 标记博客记录为已删除状态
    blog.isDeleted = true;
    await blog.save();

    res.json({ msg: "OK" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryByTag(req, res) {
  try {
    const { tagId } = req.params;

    const result = await Tag.findAll({
      where: {
        id: tagId,
      },
      attributes: {
        exclude: ["isDeleted", "createdAt", "updatedAt"],
      },
      include: {
        model: Blog,
        as: "blogs",
        where: {
          isDeleted: false,
        },
        attributes: {
          exclude: ["isDeleted"],
        },
        through: {
          attributes: [],
        },
      },
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createBlog,
  getBlogList,
  getBlogById,
  updateBlog,
  deleteBlog,
  queryByTag,
};
