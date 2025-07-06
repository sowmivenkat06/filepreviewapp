// backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { transporter } from '../utils/mailer.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ email });

    if (user) {
      // Update OTP if user already exists
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      // New user
      user = new User({ email, password: hashedPassword, otp, otpExpiry });
    }

    await user.save();

    // Send OTP
    await transporter.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const verifyOTP = async (req, res) => {
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
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

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
};
