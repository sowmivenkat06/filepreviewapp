import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  path: String,
  uploadedBy: String
});

export default mongoose.model('File', fileSchema);
