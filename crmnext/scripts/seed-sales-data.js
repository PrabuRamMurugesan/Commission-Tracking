// crmnext/scripts/seed-sales-data.js
// Simple Node.js script to seed sales data
// Run with: node scripts/seed-sales-data.js

const mongoose = require("mongoose");
const { Transaction } = require("../models/Transaction");

// Update with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/BBSlive";

const platforms = ["BBSCART", "Golddex", "Thiaworld"];
const sellerRoles = ["Vendor", "Agent", "CBAV", "Franchisee"];
const paymentStatuses = ["paid", "escrow", "failed"];
const orderStatuses = ["delivered", "returned", "cancelled"];
const paymentMethods = ["Wallet", "UPI", "Netbanking", "COD", "Razorpay"];
const gstTypes = ["CGST_SGST", "IGST"];
const payoutStatuses = ["paid", "pending", "on-hold"];

const generateDummySales = (count = 50) => {
  const dummySales = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const sellerRole = sellerRoles[Math.floor(Math.random() * sellerRoles.length)];
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const gstType = gstTypes[Math.floor(Math.random() * gstTypes.length)];
    const payoutStatus = payoutStatuses[Math.floor(Math.random() * payoutStatuses.length)];

    const baseAmount = Math.floor(Math.random() * 50000) + 1000;
    const cgstPercent = gstType === "CGST_SGST" ? 9 : 0;
    const sgstPercent = gstType === "CGST_SGST" ? 9 : 0;
    const igstPercent = gstType === "IGST" ? 18 : 0;
    const cgst = (baseAmount * cgstPercent) / 100;
    const sgst = (baseAmount * sgstPercent) / 100;
    const igst = (baseAmount * igstPercent) / 100;
    const totalGST = cgst + sgst + igst;
    const finalAmount = baseAmount + totalGST;
    const commissionPercent = Math.floor(Math.random() * 10) + 2;
    const commissionApplied = (finalAmount * commissionPercent) / 100;

    const productCount = Math.floor(Math.random() * 5) + 1;
    const productTitles = [];
    const productNames = [
      "Gold Ring 24K",
      "Gold Chain 22K",
      "Silver Coin Set",
      "Premium Gold Necklace",
      "Silver Jewelry Set",
      "Gold Earrings 22K",
      "Platinum Ring",
      "Gold Bracelet 18K",
      "Grocery Essentials Pack",
      "Organic Vegetables",
      "Organic Spices Pack",
      "Honey Jar",
      "Fresh Fruits Basket",
      "Dairy Products Pack",
    ];
    for (let j = 0; j < productCount; j++) {
      productTitles.push(
        productNames[Math.floor(Math.random() * productNames.length)]
      );
    }

    dummySales.push({
      orderId: `ORD-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: `TXN-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      platform: platform,
      sellerName: `${sellerRole} ${i + 1}`,
      sellerRole: sellerRole,
      buyerName: `Customer ${i + 1}`,
      buyerPhone: `9${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      paymentStatus: paymentStatus,
      orderStatus: orderStatus,
      paymentMethod: paymentMethod,
      gstType: gstType,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100,
      totalGSTAmount: Math.round(totalGST * 100) / 100,
      amount: baseAmount,
      finalAmount: Math.round(finalAmount * 100) / 100,
      commissionApplied: Math.round(commissionApplied * 100) / 100,
      payoutStatus: payoutStatus,
      productTitles: productTitles,
      totalQuantity: productCount,
      date: date,
      createdAt: date,
      updatedAt: date,
    });
  }

  return dummySales;
};

async function seedSalesData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const count = process.argv[2] ? parseInt(process.argv[2]) : 50;
    const clear = process.argv[3] === "clear";

    if (clear) {
      const deleted = await Transaction.deleteMany({});
      console.log(`🗑️  Cleared ${deleted.deletedCount} existing transactions`);
    }

    const existingCount = await Transaction.countDocuments({});
    if (existingCount > 0 && !clear) {
      console.log(`⚠️  Database already contains ${existingCount} transactions.`);
      console.log(`   Run with "clear" argument to replace: node scripts/seed-sales-data.js ${count} clear`);
      process.exit(1);
    }

    console.log(`Generating ${count} dummy sales transactions...`);
    const dummySales = generateDummySales(count);

    console.log("Inserting into database...");
    const inserted = await Transaction.insertMany(dummySales);

    const summary = {
      orders: inserted.length,
      revenue: inserted.reduce((sum, txn) => sum + (txn.finalAmount || 0), 0),
      quantity: inserted.reduce((sum, txn) => sum + (txn.totalQuantity || 1), 0),
    };

    console.log("\n✅ Successfully seeded sales data!");
    console.log(`   Total Orders: ${summary.orders}`);
    console.log(`   Total Revenue: ₹${summary.revenue.toFixed(2)}`);
    console.log(`   Total Quantity: ${summary.quantity}`);

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding sales data:", error);
    process.exit(1);
  }
}

seedSalesData();
