const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  whatsappNumber: String,
  profilePic: String,
  designation: String,
  zone: String,
  franchiseeId: mongoose.Schema.Types.ObjectId,
  platform: String,
  role: String,
  referredBy: String,
  status: String,
  walletBalance: Number,
  totalOrders: Number,
  kycStatus: String,
  lastActive: Date,
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
