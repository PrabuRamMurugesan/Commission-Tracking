const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, required: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  rewardAmount: { type: Number, required: true },
  dateAwarded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', rewardSchema);
