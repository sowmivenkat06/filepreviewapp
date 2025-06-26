import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  otpExpiry: Date
});

export default mongoose.model('User', userSchema);
