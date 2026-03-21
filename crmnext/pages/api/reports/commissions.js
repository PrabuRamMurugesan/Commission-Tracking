// pages/api/reports/commissions.js
import dbConnect from '../../../lib/mongodb';
import CommissionTransaction from '../../../models/Commission';
import allowCors from "../../../middleware/cors";
///////////////////////////////////////////
async function handler(req, res) {

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { 
      page = 1, 
      limit = 100, 
      search = '', 
      platform = '', 
      payoutStatus = '', 
      sellerRole = '',
      paymentStatus = '',
      orderStatus = '',
      paymentMethod = '',
      sellerName = '',
      startDate, 
      endDate,
      fromDate,
      toDate 
    } = req.query;

    // Support both startDate/endDate and fromDate/toDate
    const dateFrom = startDate || fromDate;
    const dateTo = endDate || toDate;

    const filters = {};

    if (platform) filters.platform = platform;
    if (payoutStatus) filters.payoutStatus = payoutStatus;
    if (sellerRole) filters.role = sellerRole;
    
    if (dateFrom && dateTo) {
      filters.date = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
    } else {
      // Default to last 30 days if no dates provided
      const defaultEndDate = new Date();
      const defaultStartDate = new Date();
      defaultStartDate.setDate(defaultStartDate.getDate() - 30);
      filters.date = {
        $gte: defaultStartDate,
        $lte: defaultEndDate,
      };
    }

    if (search) {
      filters.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } }
      ];
    }

    if (sellerName) {
      filters.sellerName = { $regex: sellerName, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      CommissionTransaction.find(filters)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CommissionTransaction.countDocuments(filters)
    ]);

    // Transform data to match frontend expectations
    const transformedTransactions = transactions.map((comm) => ({
      _id: comm._id,
      date: comm.date || comm.createdAt,
      platform: comm.platform || "BBSCART",
      sellerName: comm.sellerName || "-",
      role: comm.role || "-",
      commissionAmount: comm.amount || 0,
      commissionPercent: comm.rate || 0,
      transactionId: comm.transactionId || "-",
      orderId: comm.orderId || "-",
      payoutStatus: comm.payoutStatus || "Pending",
      // Additional fields for expandable row
      orderStatus: comm.orderStatus || "-",
      paymentMethod: comm.paymentMethod || "-",
      finalAmount: comm.finalAmount || comm.amount || 0,
      buyerName: comm.buyerName || "-",
      buyerPhone: comm.buyerPhone || "-",
    }));

    // Calculate summary
    const summary = {
      commissions: total,
      totalAmount: transactions.reduce((sum, comm) => sum + (comm.amount || 0), 0),
    };

    res.status(200).json({ 
      transactions: transformedTransactions, 
      summary,
      pagination: { 
        total, 
        page: parseInt(page), 
        limit: parseInt(limit) 
      } 
    });
  } catch (error) {
    console.error('Commission Report Fetch Error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching commission report.',
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

export default allowCors(handler);