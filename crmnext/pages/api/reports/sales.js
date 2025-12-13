
import dbConnect from "../../../lib/mongodb";
const { Transaction } = require("../../../models/Transaction");
import User from "../../../models/User";
import exceljs from "exceljs";


export default (async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    startDate,
    endDate,
    platform,
    sellerType,
    paymentStatus,
    orderStatus,
    paymentMethod,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
    download = false,
  } = req.query;

  const query = {};

  // Date filter
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Other filters
  if (platform) query.platform = platform;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (orderStatus) query.orderStatus = orderStatus;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (sellerType) query.sellerRole = sellerType;

  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: "i" } },
      { transactionId: { $regex: search, $options: "i" } },
      { "seller.name": { $regex: search, $options: "i" } },
    ];
  }

  // Populate and build final query
  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const transactions = await Transaction.find(query)
    .populate("vendorId", "name role phone")
    .populate("franchiseeId", "name role phone")
    .populate("customerId", "name phone")
    .sort(sortOptions)
    .skip(download ? 0 : skip)
    .limit(download ? 1000 : parseInt(limit));
  const reshapedTransactions = transactions.map((txn) => {
    // Determine seller info
    const seller = txn.vendorId || txn.franchiseeId || {};
    const customer = txn.customerId || {};

    return {
      id: txn._id,
      date: new Date(txn.date).toISOString().split("T")[0],
      orderId: txn.orderId || "-",
      transactionId: txn.transactionId || "-",
      platform: txn.platform || "-",
      paymentMethod: txn.paymentMethod || "-",
      paymentStatus: txn.paymentStatus || "-",
      orderStatus: txn.orderStatus || "-",
      payoutStatus: txn.payoutStatus || "-",
      finalAmount: txn.finalAmount || 0,
      commission: txn.commission || 0,
      sellerName: txn.sellerName || "-",
      sellerRole: txn.sellerRole || "-",
      sellerPhone: txn.sellerPhone || "-",
      buyerPhone: txn.buyerPhone || "-",
      gstType: txn.gstType || "-",
      cgst: txn.cgst || 0,
      sgst: txn.sgst || 0,
      igst: txn.igst || 0,
      totalGSTAmount: txn.totalGSTAmount || 0,
      products: txn.products || [],
    };
  });

  if (download === "true") {
    // Generate Excel using exceljs
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

    // Header
    sheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Order ID", key: "orderId", width: 20 },
      { header: "Transaction ID", key: "transactionId", width: 20 },
      { header: "Platform", key: "platform", width: 15 },
      { header: "Seller Name", key: "sellerName", width: 20 },
      { header: "Seller Role", key: "sellerRole", width: 15 },
      { header: "Buyer Phone", key: "buyerPhone", width: 20 },
      { header: "Payment Method", key: "paymentMethod", width: 15 },
      { header: "Payment Status", key: "paymentStatus", width: 15 },
      { header: "Order Status", key: "orderStatus", width: 15 },
      { header: "Final Amount", key: "finalAmount", width: 15 },
      { header: "Commission Applied", key: "commission", width: 20 },
      { header: "Payout Status", key: "payoutStatus", width: 20 },
    ];

    // Data
    transactions.forEach((txn) => {
      sheet.addRow({
        date: tx.date ? new Date(tx.date).toLocaleDateString("en-CA") : "-",
        orderId: txn.orderId,
        transactionId: txn.transactionId,
        platform: txn.platform,
        totalGSTAmount: txn.totalGSTAmount || 0,
        sellerName: txn.seller?.name || "—",
        sellerRole: txn.seller?.role || "—",
        buyerPhone: txn.customer?.phone || "—",
        paymentMethod: txn.paymentMethod,
        paymentStatus: txn.paymentStatus,
        orderStatus: txn.orderStatus,
        finalAmount: txn.finalAmount,
        commission: txn.commissionRate + "%",
        payoutStatus: txn.payoutStatus,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
    return;
  }
  console.log("🟢 Reshaped Transactions:", reshapedTransactions);
  // Normal response
  const total = await Transaction.countDocuments(query);

  res.status(200).json({
    transactions: reshapedTransactions,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    },
  });
});
