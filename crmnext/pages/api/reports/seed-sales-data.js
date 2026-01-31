// crmnext/pages/api/reports/seed-sales-data.js
// This endpoint seeds the database with dummy sales data
import dbConnect from "../../../lib/mongodb";
const { Transaction } = require("../../../models/Transaction");
import handleCors from "../../../lib/cors";

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
    const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
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

    const baseAmount = Math.floor(Math.random() * 50000) + 1000; // ₹1000 to ₹51000
    const cgstPercent = gstType === "CGST_SGST" ? 9 : 0;
    const sgstPercent = gstType === "CGST_SGST" ? 9 : 0;
    const igstPercent = gstType === "IGST" ? 18 : 0;
    const cgst = (baseAmount * cgstPercent) / 100;
    const sgst = (baseAmount * sgstPercent) / 100;
    const igst = (baseAmount * igstPercent) / 100;
    const totalGST = cgst + sgst + igst;
    const finalAmount = baseAmount + totalGST;
    const commissionPercent = Math.floor(Math.random() * 10) + 2; // 2% to 12%
    const commissionApplied = (finalAmount * commissionPercent) / 100;

    const productCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 products
    const productTitles = [];
    for (let j = 0; j < productCount; j++) {
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

export default async function handler(req, res) {
  await handleCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { count = 50, clear = false } = req.body;

    // Clear existing transactions if requested
    if (clear === true) {
      const deleted = await Transaction.deleteMany({});
      console.log(`Cleared ${deleted.deletedCount} existing transactions`);
    }

    // Check if transactions already exist
    const existingCount = await Transaction.countDocuments({});
    if (existingCount > 0 && clear !== true) {
      return res.status(400).json({
        message: `Database already contains ${existingCount} transactions. Set "clear": true in request body to replace them.`,
        existingCount: existingCount,
      });
    }

    // Generate dummy sales data
    const dummySales = generateDummySales(count);

    // Insert into database
    const inserted = await Transaction.insertMany(dummySales);

    // Calculate summary
    const summary = {
      orders: inserted.length,
      revenue: inserted.reduce((sum, txn) => sum + (txn.finalAmount || 0), 0),
      quantity: inserted.reduce((sum, txn) => sum + (txn.totalQuantity || 1), 0),
    };

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${inserted.length} sales transactions into the database`,
      count: inserted.length,
      summary: summary,
      sample: inserted.slice(0, 3).map((txn) => ({
        orderId: txn.orderId,
        transactionId: txn.transactionId,
        platform: txn.platform,
        sellerName: txn.sellerName,
        finalAmount: txn.finalAmount,
      })),
    });
  } catch (error) {
    console.error("Error seeding sales data:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding sales data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
