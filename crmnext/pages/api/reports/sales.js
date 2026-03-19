// crmnext/pages/api/reports/sales.js
import dbConnect from "../../../utils/dbConnect";
import { Transaction } from "../../../models/Transaction";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const {
      startDate,
      endDate,
      platform,
      sellerRole,
      paymentStatus,
      orderStatus,
      paymentMethod,
      sellerName,
      search,
      download,
    } = req.query;

    // Build query
    const query = {};

    // Date filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last 30 days if no date range provided
      const defaultEndDate = new Date();
      const defaultStartDate = new Date();
      defaultStartDate.setDate(defaultStartDate.getDate() - 30);
      query.date = {
        $gte: defaultStartDate,
        $lte: defaultEndDate,
      };
    }

    // Other filters
    if (platform) query.platform = platform;
    if (sellerRole) query.sellerRole = sellerRole;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (sellerName) query.sellerName = { $regex: sellerName, $options: "i" };

    // Search filter
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
        { buyerName: { $regex: search, $options: "i" } },
        { buyerPhone: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch transactions
    // Note: Only populate fields that exist in the Transaction schema
    let transactions = await Transaction.find(query)
      .populate("vendorId", "name")
      .populate("franchiseeId", "name")
      .populate("sellerId", "name")
      .populate("customerId", "name phone")
      .sort({ date: -1 })
      .limit(download === "true" ? 1000 : 100);

    // If no transactions found, return empty array (don't error)
    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        transactions: [],
        summary: {
          orders: 0,
          revenue: 0,
          quantity: 0,
        },
      });
    }

    // Transform transactions to match frontend expectations
    const transformedTransactions = transactions.map((txn) => {
      // Determine seller info - Transaction schema has vendorId, franchiseeId, sellerId, but not agentId
      const seller = txn.vendorId || txn.franchiseeId || txn.sellerId || {};
      const customer = txn.customerId || {};

      // Format products array
      const products = txn.productTitles?.map((title, index) => ({
        title: title || `Product ${index + 1}`,
        quantity: 1,
        price: (txn.finalAmount || 0) / (txn.productTitles?.length || 1),
      })) || [
        {
          title: "Product",
          quantity: txn.totalQuantity || 1,
          price: txn.finalAmount || 0,
        },
      ];

      return {
        _id: txn._id.toString(),
        date: txn.date
          ? new Date(txn.date).toISOString().split("T")[0] +
            " " +
            new Date(txn.date).toTimeString().split(" ")[0]
          : new Date(txn.createdAt).toISOString().split("T")[0] +
            " " +
            new Date(txn.createdAt).toTimeString().split(" ")[0],
        orderId: txn.orderId || `ORD-${txn._id.toString().slice(-6)}`,
        transactionId: txn.transactionId || `TXN-${txn._id.toString().slice(-6)}`,
        platform: txn.platform || "BBSCART",
        products: products,
        sellerName: txn.sellerName || seller?.name || "Unknown Seller",
        sellerRole: txn.sellerRole || "Vendor",
        buyerPhone: txn.buyerPhone || customer?.phone || "-",
        buyerName: txn.buyerName || customer?.name || "-",
        paymentStatus: txn.paymentStatus || "paid",
        orderStatus: txn.orderStatus || "delivered",
        paymentMethod: txn.paymentMethod || "UPI",
        gstType: txn.gstType || "CGST_SGST",
        cgst: txn.cgst || 0,
        sgst: txn.sgst || 0,
        igst: txn.igst || 0,
        totalGSTAmount: txn.totalGSTAmount || 0,
        finalAmount: txn.finalAmount || txn.amount || 0,
        commission: txn.commissionApplied
          ? ((txn.commissionApplied / (txn.finalAmount || txn.amount || 1)) * 100).toFixed(2)
          : "0",
        payoutStatus: txn.payoutStatus || "pending",
      };
    });

    // Calculate summary
    const summary = {
      orders: transactions.length,
      revenue: transactions.reduce(
        (sum, txn) => sum + (txn.finalAmount || txn.amount || 0),
        0
      ),
      quantity: transactions.reduce(
        (sum, txn) => sum + (txn.totalQuantity || 1),
        0
      ),
    };

    // Handle Excel export
    if (download === "true") {
      const ExcelJS = require("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Report");

      // Set columns
      worksheet.columns = [
        { header: "Date/Time", key: "date", width: 20 },
        { header: "Order ID", key: "orderId", width: 20 },
        { header: "Transaction ID", key: "transactionId", width: 20 },
        { header: "Platform", key: "platform", width: 15 },
        { header: "Seller Name", key: "sellerName", width: 20 },
        { header: "Seller Role", key: "sellerRole", width: 15 },
        { header: "Buyer Name", key: "buyerName", width: 20 },
        { header: "Buyer Phone", key: "buyerPhone", width: 15 },
        { header: "Payment Status", key: "paymentStatus", width: 15 },
        { header: "Order Status", key: "orderStatus", width: 15 },
        { header: "Payment Method", key: "paymentMethod", width: 15 },
        { header: "GST Type", key: "gstType", width: 15 },
        { header: "CGST ₹", key: "cgst", width: 12 },
        { header: "SGST ₹", key: "sgst", width: 12 },
        { header: "IGST ₹", key: "igst", width: 12 },
        { header: "Total GST ₹", key: "totalGSTAmount", width: 15 },
        { header: "Final Amount ₹", key: "finalAmount", width: 15 },
        { header: "Commission %", key: "commission", width: 15 },
        { header: "Payout Status", key: "payoutStatus", width: 15 },
      ];

      // Add rows
      transformedTransactions.forEach((txn) => {
        worksheet.addRow({
          date: txn.date,
          orderId: txn.orderId,
          transactionId: txn.transactionId,
          platform: txn.platform,
          sellerName: txn.sellerName,
          sellerRole: txn.sellerRole,
          buyerName: txn.buyerName,
          buyerPhone: txn.buyerPhone,
          paymentStatus: txn.paymentStatus,
          orderStatus: txn.orderStatus,
          paymentMethod: txn.paymentMethod,
          gstType: txn.gstType,
          cgst: txn.cgst,
          sgst: txn.sgst,
          igst: txn.igst,
          totalGSTAmount: txn.totalGSTAmount,
          finalAmount: txn.finalAmount,
          commission: txn.commission,
          payoutStatus: txn.payoutStatus,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=sales_report_${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
      return res.end();
    }

    // Return JSON response
    res.status(200).json({
      transactions: transformedTransactions,
      summary: summary,
    });
  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({
      message: "Error fetching sales data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export default allowCors(handler);
