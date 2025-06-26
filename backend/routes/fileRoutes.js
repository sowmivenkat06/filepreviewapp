import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import File from '../models/File.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
      uploadedBy: req.user.email
    });
    await file.save();
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const files = await File.find({ uploadedBy: req.user.email });
  res.status(200).json(files);
});

export default router;

