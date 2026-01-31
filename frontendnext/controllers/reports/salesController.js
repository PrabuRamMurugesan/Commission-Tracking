// backend/controllers/reports/salesController.js

const Transaction = require("../../models/Transaction");
const excelJS = require("exceljs");

exports.getSalesReport = async (req, res) => {
  try {
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
      limit = 20,
      download,
    } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (platform) query.platform = platform;
    if (sellerType) query.sellerRole = sellerType;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
        { buyerName: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const transactions = await Transaction.find(query)
      .populate("sellerId", "name") // assumes User model
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (download === "true") {
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Report");

      worksheet.columns = [
        { header: "Date", key: "createdAt", width: 20 },
        { header: "Order ID", key: "orderId", width: 20 },
        { header: "Transaction ID", key: "transactionId", width: 20 },
        { header: "Platform", key: "platform", width: 15 },
        { header: "Product Titles", key: "productTitles", width: 30 },
        { header: "Seller Name", key: "sellerName", width: 20 },
        { header: "Seller Role", key: "sellerRole", width: 15 },
        { header: "Buyer Name", key: "buyerName", width: 20 },
        { header: "Payment Status", key: "paymentStatus", width: 15 },
        { header: "Order Status", key: "orderStatus", width: 15 },
        { header: "Payment Method", key: "paymentMethod", width: 20 },
        { header: "Final Amount", key: "finalAmount", width: 15 },
        { header: "Commission %", key: "commissionPercent", width: 15 },
        { header: "Payout Status", key: "payoutStatus", width: 15 },
      ];

      transactions.forEach((txn) => {
        worksheet.addRow({
          createdAt: txn.createdAt.toISOString(),
          orderId: txn.orderId,
          transactionId: txn.transactionId,
          platform: txn.platform,
          productTitles: txn.products
            .map((p) => `${p.title} x${p.quantity}`)
            .join(", "),
          sellerName: txn.sellerId?.name || "-",
          sellerRole: txn.sellerRole,
          buyerName: txn.buyerName,
          paymentStatus: txn.paymentStatus,
          orderStatus: txn.orderStatus,
          paymentMethod: txn.paymentMethod,
          finalAmount: txn.finalAmount,
          commissionPercent: txn.commissionPercent,
          payoutStatus: txn.payoutStatus,
          gstType: txn.gstType || "-",
          cgst: txn.cgst || 0,
          sgst: txn.sgst || 0,
          igst: txn.igst || 0,
          totalGSTAmount: txn.totalGSTAmount || 0
        })
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=sales_report_${Date.now()}.xlsx`
      );

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }

    const totalCount = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      total: totalCount,
      page,
      limit,
      transactions,
    });
  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
