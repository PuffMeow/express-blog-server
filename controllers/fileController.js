// 上传封面图
async function uploadFile(req, res) {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file provided" });
  }

  res.json({ msg: "File uploaded successfully", filePath: file.url });
}

module.exports = { uploadFile };
