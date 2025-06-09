// scripts/customerSeed.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Customer = require("../models/Customer/CustomerReport");

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not found in .env");
}

mongoose.connect(MONGO_URI).then(async () => {
  try {
    console.log("✅ Connected to MongoDB");

    await Customer.deleteMany({});
    console.log("🗑️ Old customer data removed");

    const dummyCustomers = [
      {
        customerId: "CUST1001",
        name: "Bala Bharath",
        email: "bharath@example.com",
        phone: "9876543210",
        platform: "BBSCART",
        role: "Customer",
        referredBy: "AGENT123",
        zone: "Pondicherry",
        status: "Active",
        walletBalance: 500,
        totalOrders: 3,
        kycStatus: "Verified",
        lastActive: new Date(),
        comments: "Top customer in zone.",
      },
      {
        customerId: "CUST1002",
        name: "Keerthi Raj",
        email: "keerthi@example.com",
        phone: "8765432109",
        platform: "Golddex",
        role: "Vendor",
        referredBy: "CBV456",
        zone: "Chennai",
        status: "Blocked",
        walletBalance: 0,
        totalOrders: 0,
        kycStatus: "Pending",
        lastActive: new Date(),
        comments: "Under review for fraud.",
      },
    ];

    const result = await Customer.insertMany(dummyCustomers, { ordered: true });
    console.log(`✅ ${result.length} dummy customers inserted successfully`);
  } catch (err) {
    console.error("❌ Seeder Error:", err.message);
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
});
