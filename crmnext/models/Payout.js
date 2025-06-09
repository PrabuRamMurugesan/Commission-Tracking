const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  recipientAccount: { type: String, required: true },
  role: {
    type: String,
    enum: ["Agent", "Vendor", "Franchise", "TerritoryHead", "Referral"],
    required: true,
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Retrying', 'Completed', 'Failed'], default: 'Pending' },
  method: { type: String, required: true },
  retries: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payout', payoutSchema);
