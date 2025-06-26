import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { transporter } from '../utils/mailer.js';

const router = express.Router();

/**
 * ✅ Signup + Send OTP
 */
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password: hashedPassword, otp, otpExpiry });
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Your OTP Code',
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>This OTP will expire in 5 minutes.</p>`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    res.status(500).json({ message: 'Signup failed. Try again.' });
  }
});

/**
 * ✅ Verify OTP
 */
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified — clear it and generate token
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });

  } catch (err) {
    console.error('❌ OTP Verification Error:', err.message);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

/**
 * ✅ Login
 */
router.post('/login', async (req, res) => {
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

export default router;
