import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  endpoint: { type: String, required: true },
  bodyHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.IdempotencyKey ||
  mongoose.model('IdempotencyKey', schema);
