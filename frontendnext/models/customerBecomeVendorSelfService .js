const mongoose = require("mongoose");

const CustomerBecomeVendorSelfServiceSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  vendorId: { type: String, unique: true }, // Assigned vendor ID after transition
  name: { type: String, required: true }, // Name of the vendor
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  businessName: { type: String, default: null }, // Optional business name
  totalSales: { type: Number, default: 0 }, // Total sales made after becoming a vendor
  commissionEarned: { type: Number, default: 0 }, // AI-calculated commission
  payoutsReceived: { type: Number, default: 0 }, // Total payouts received
  activeCustomers: { type: Number, default: 0 }, // Customers purchasing from this vendor
  productInventory: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      productName: { type: String },
      stockAvailable: { type: Number },
      salesCount: { type: Number },
    },
  ],
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
  lastPayoutDate: { type: Date, default: null }, // Last date of payout received
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CustomerBecomeVendorSelfService = mongoose.model(
  "CustomerBecomeVendorSelfService",
  CustomerBecomeVendorSelfServiceSchema
);
module.exports = CustomerBecomeVendorSelfService;
