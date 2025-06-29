index of backend 

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ✅ CORS for local + production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://filepreviewapp-1.onrender.com',
  'https://your-frontend.vercel.app' // 🔁 Replace with your actual deployed frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Schemas & Models
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  otpExpiry: Date
});
const User = mongoose.model('User', userSchema);

const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  path: String,
  uploadedBy: String
});
const File = mongoose.model('File', fileSchema);

// 📧 Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📤 Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// 🛡️ JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// ✅ Signup Route - Send OTP
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      user = new User({ email, password: hashedPassword, otp, otpExpiry });
    }

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>This OTP will expire in 5 minutes.</p>`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// ✅ Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'OTP verified', token });
  } catch (err) {
    console.error('❌ OTP Verification Error:', err.message);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

// ✅ Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ Upload File
app.post('/api/files/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { originalname, mimetype, path } = req.file;
    const uploadedBy = req.user.email;

    const file = new File({ filename: originalname, mimetype, path, uploadedBy });
    await file.save();

    res.status(201).json(file);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// ✅ Get Files
app.get('/api/files', verifyToken, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.email });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: 'Fetching files failed' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('📦 Loaded MONGO_URI:', process.env.MONGO_URI);
});
