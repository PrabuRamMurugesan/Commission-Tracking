// crmnext/pages/api/reports/generate-dummy-sales.js
// This endpoint generates dummy sales data for testing
import dbConnect from "../../../lib/mongodb";
const { Transaction } = require("../../../models/Transaction");
import allowCors from "../../../middleware/cors";
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
      productTitles.push(`Product ${j + 1} - ${platform}`);
    }

    dummySales.push({
      orderId: `ORD-${Date.now()}-${i}`,
      transactionId: `TXN-${Date.now()}-${i}`,
      platform: platform,
      sellerName: `${sellerRole} ${i + 1}`,
      sellerRole: sellerRole,
      buyerName: `Customer ${i + 1}`,
      buyerPhone: `9${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      paymentStatus: paymentStatus,
      orderStatus: orderStatus,
      paymentMethod: paymentMethod,
      gstType: gstType,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      totalGSTAmount: totalGST,
      amount: baseAmount,
      finalAmount: finalAmount,
      commissionApplied: commissionApplied,
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

async function handler(req, res) {

   if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { count = 50 } = req.body;

    // Generate dummy sales data
    const dummySales = generateDummySales(count);

    // Insert into database
    const inserted = await Transaction.insertMany(dummySales);

    res.status(200).json({
      message: `Successfully generated ${inserted.length} dummy sales records`,
      count: inserted.length,
      sample: inserted.slice(0, 5), // Return first 5 as sample
    });
  } catch (error) {
    console.error("Error generating dummy sales:", error);
    res.status(500).json({
      message: "Error generating dummy sales data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export default allowCors(handler);