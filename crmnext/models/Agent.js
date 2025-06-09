// models/Agent.js
import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    whatsappNumber: String,
    password: String,
    profilePic: String,
    designation: String,
    zone: String,
    businessPartnerCode: String,
    franchiseeId: mongoose.Schema.Types.ObjectId,
    platform: String,
    commissionRates: [
      {
        walletBalance: Number,
        totalOrders: Number,
      },
    ],
    accountStatus: String,
    joinedDate: Date,
    kycStatus: String,
    lastActive: Date,
    loginHistory: Array,
    comments: String,
  },
  { timestamps: true }
);

export default mongoose.models.Agent || mongoose.model("Agent", agentSchema);
