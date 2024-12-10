import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  preferences: { type: Object, default: {} },
});

export default mongoose.model('User', userSchema);
