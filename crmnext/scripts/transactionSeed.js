const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Transaction } = require("../models/Transaction");

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const runSeeder = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Transaction.deleteMany({});
    console.log("🗑️ Old transactions removed");

    const sampleData = [
      {
        transactionId: "TXN1001",
        orderId: "ORD1001",
        platform: "BBSCART",
        customerId: new mongoose.Types.ObjectId(),
        buyerName: "Buyer A",
        buyerPhone: "9876543210",
        sellerRole: "Vendor",
        transactionType: "Debit",
        transactionCategory: "Order Payment",
        amount: 1500,
        balanceAfter: 3500,
        paymentMethod: "UPI",
        status: "success",
        comments: "Order placed for BBSCART",
        date: new Date("2025-05-25"),

        // GST Info
        isGSTApplicable: true,
        gstType: "CGST_SGST",
        cgstPercentage: 9,
        sgstPercentage: 9,
        totalGSTAmount: 270,
        gstBreakdown: {
          cgst: 135,
          sgst: 135,
        },
      },
      {
        transactionId: "TXN1002",
        orderId: "ORD1002",
        platform: "Golddex",
        customerId: new mongoose.Types.ObjectId(),
        buyerName: "Buyer B",
        buyerPhone: "8765432109",
        sellerRole: "Franchisee",
        transactionType: "Debit",
        transactionCategory: "Order Payment",
        amount: 3000,
        balanceAfter: 6000,
        paymentMethod: "Wallet",
        status: "success",
        comments: "Order paid using Golddex Wallet",
        date: new Date("2025-05-25"),

        // GST Info
        isGSTApplicable: true,
        gstType: "IGST",
        igstPercentage: 18,
        totalGSTAmount: 540,
        gstBreakdown: {
          igst: 540,
        },
      },
      {
        transactionId: "TXN1003",
        orderId: "ORD1003",
        platform: "BBSCART",
        vendorId: new mongoose.Types.ObjectId(),
        buyerName: "Vendor A",
        buyerPhone: "7654321098",
        sellerRole: "Vendor",
        transactionType: "Credit",
        transactionCategory: "Commission Payout",
        amount: 1200,
        balanceAfter: 4200,
        paymentMethod: "Wallet",
        status: "success",
        comments: "Commission sent for May 2025",
        date: new Date("2025-05-26"),

        // GST Info
        isGSTApplicable: false,
        gstType: null,
        totalGSTAmount: 0,
      },
    ];

    await Transaction.insertMany(sampleData);
    console.log("✅ Sample transactions inserted");
    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

runSeeder();
