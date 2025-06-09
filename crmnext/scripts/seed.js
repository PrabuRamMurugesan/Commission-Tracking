const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Transaction } = require("../models/Transaction");

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not found in .env");
}

mongoose.connect(MONGO_URI).then(async () => {
    const dummyTransactions = [
      {
        vendorId: new mongoose.Types.ObjectId(),
        customerId: new mongoose.Types.ObjectId(),
        orderId: "ORD1001",
        transactionId: "TXN1001",
        platform: "BBSCART",
        productTitles: ["Ring", "Necklace"],
        sellerName: "Vendor A",
        sellerRole: "Vendor",
        buyerName: "Buyer A",
        buyerPhone: "9876543210",
        amount: 1500,
        finalAmount: 1500,
        commissionApplied: 5,
        paymentStatus: "paid",
        orderStatus: "delivered",
        paymentMethod: "UPI",
        payoutStatus: "paid",
        date: new Date(),
      },
      {
        franchiseeId: new mongoose.Types.ObjectId(),
        orderId: "ORD1002",
        transactionId: "TXN1002",
        platform: "Golddex",
        productTitles: ["Bracelet"],
        sellerName: "Franchise B",
        sellerRole: "Franchisee",
        buyerName: "Buyer B",
        buyerPhone: "8765432109",
        amount: 3000,
        finalAmount: 3000,
        commissionApplied: 7,
        paymentStatus: "escrow",
        orderStatus: "returned",
        paymentMethod: "Wallet",
        payoutStatus: "paid",
        date: new Date(),
      },
    ];
      

  try {
    const result = await Transaction.insertMany(dummyTransactions, {
      ordered: true,
    });
    console.log("✅ Dummy sales data inserted successfully:", result.length);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    console.error("Details:", err.errors || err);
  }
  
});
