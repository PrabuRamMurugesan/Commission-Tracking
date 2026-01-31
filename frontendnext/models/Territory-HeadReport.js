// models/Territory-HeadReport.js
import mongoose from "mongoose";

const territoryHeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    whatsappNumber: String,
    password: String,
    profilePic: String,
    designation: String,
    zone: String,
    stateCode: String,
    cityCode: String,
    franchiseeId: mongoose.Schema.Types.ObjectId,
    businessPartnerCode: String,
    platform: String,
    commissionRates: [
      {
        walletBalance: Number,
        totalOrders: Number,
      },
    ],
    accountStatus: String,
    joinedDate: Date,
    loginHistory: Array,
    kycStatus: String,
    lastActive: Date,
    comments: String,
  },
  { timestamps: true }
);

// 👇 Force the correct collection name: 'territories'
export default mongoose.models["TerritoryHeadReport"] ||
  mongoose.model("TerritoryHeadReport", territoryHeadSchema, "territories");
