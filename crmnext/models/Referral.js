const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // The user who referred
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // The referred user
  bonusAmount: { type: Number, default: 0 },  // Commission bonus for referral
  referralDate: { type: Date, default: Date.now },  // Date of referral
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }  // Status of referral
});

module.exports = mongoose.model('Referral', referralSchema);

// To be verified and updated , if nesscceary 
// const mongoose = require("mongoose");

// const ReferralSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, enum: ["Customer", "Vendor", "Agent"], required: true },
//   commission: { type: Number, default: 0 },
//   status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
// });

// module.exports = mongoose.model("Referral", ReferralSchema);
