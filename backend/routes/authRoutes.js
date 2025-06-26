import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { transporter } from '../utils/mailer.js';

const router = express.Router();

// Send OTP
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    user = new User({ email, password: hashedPassword, otp, otpExpiry });
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'OTP Verification',
      html: `<p>Your OTP is: <b>${otp}</b></p>`
    });

    console.log('OTP sent:', otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ token });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Incorrect password' });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

export default router;
