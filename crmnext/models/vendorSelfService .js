const mongoose = require("mongoose");

const VendorSelfServiceSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  businessName: { type: String, required: true }, // Vendor's Business Name
  ownerName: { type: String, required: true }, // Vendor's Owner Name
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  totalSales: { type: Number, default: 0 }, // Total sales made by vendor
  commissionEarned: { type: Number, default: 0 }, // AI-calculated commission for the vendor
  payoutsReceived: { type: Number, default: 0 }, // Total payouts received
  activeCustomers: { type: Number, default: 0 }, // Active customer base
  orderHistory: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      orderDate: { type: Date },
      amount: { type: Number },
      status: { type: String, enum: ["Completed", "Pending", "Cancelled"] },
    },
  ],
  salesTrend: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
  },
  aiRevenueForecast: { type: Number, default: 0 }, // AI-generated revenue predictions
  lastPayoutDate: { type: Date, default: null }, // Date of the last payout received
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const VendorSelfService = mongoose.model("VendorSelfService", VendorSelfServiceSchema);
module.exports = VendorSelfService;
