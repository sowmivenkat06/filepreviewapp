// backend/controllers/fileController.js
import File from '../models/File.js';

export const uploadFile = async (req, res) => {
  const { originalname, mimetype, path } = req.file;
  const uploadedBy = req.user.email;

  const file = new File({ filename: originalname, mimetype, path, uploadedBy });
  await file.save();

  res.json({ message: 'File uploaded successfully' });
};

export const getFiles = async (req, res) => {
  const files = await File.find({ uploadedBy: req.user.email });
  res.json(files);
};
