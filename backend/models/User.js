import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  otpExpiry: Date,
  name: String,
  picture: String,
  isGoogleUser: { type: Boolean, default: false },
});
user = new User({
  email,
  name,
  picture,
  isGoogleUser: true,
  password: 'google-oauth',
});


export default mongoose.model('User', userSchema);
