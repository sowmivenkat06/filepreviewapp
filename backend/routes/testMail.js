import express from 'express';
import { transporter } from '../utils/mailer.js';

const router = express.Router();

router.get('/send', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // or any test email
      subject: '✅ NodeMailer Test',
      text: 'If you received this, your config works!',
    });
    res.send('✅ Test email sent!');
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    res.status(500).send('Email failed');
  }
});

export default router;
