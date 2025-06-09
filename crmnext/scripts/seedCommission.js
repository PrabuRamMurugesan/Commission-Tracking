const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Commission = require("../models/Commission");

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  throw new Error("❌ MONGODB_URI not found in .env");
}

mongoose.connect(MONGO_URI).then(async () => {
  const dummyCommissions = [
    {
      commissionId: "COMM1001",
      vendorId: new mongoose.Types.ObjectId(),
      orderId: "ORD1001",
      transactionId: "TXN1001",
      platform: "BBSCART",
      role: "Vendor",
      sellerName: "Vendor A",
      buyerName: "Buyer A",
      buyerPhone: "9876543210",
      rate: 5,
      amount: 75,
      payoutStatus: "Paid",
      date: new Date(),
    },
    {
      commissionId: "COMM1002",
      franchiseeId: new mongoose.Types.ObjectId(),
      orderId: "ORD1002",
      transactionId: "TXN1002",
      platform: "Golddex",
      role: "Franchisee",
      sellerName: "Franchise B",
      buyerName: "Buyer B",
      buyerPhone: "8765432109",
      rate: 7,
      amount: 210,
      payoutStatus: "Pending",
      date: new Date(),
    },
  ];

  try {
    let inserted = 0;

    for (const commission of dummyCommissions) {
      const exists = await Commission.findOne({ commissionId: commission.commissionId });
      if (exists) {
        console.log(`⚠️ Skipped: ${commission.commissionId} already exists.`);
        continue;
      }

      await Commission.create(commission);
      inserted++;
      console.log(`✅ Inserted: ${commission.commissionId}`);
    }

    console.log(`\n✅ Done. ${inserted} new commission(s) inserted.`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    console.error("Details:", err.errors || err);
  }
});
