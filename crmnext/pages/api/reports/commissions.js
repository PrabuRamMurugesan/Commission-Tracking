// export default async function handler(req, res) {
//   const { status, role } = req.query;

//   const query = {};
//   if (status === "pending") query.status = "pending";
//   if (role) query.role = role;

//   const commissions = await Commission.find(query);
//   res.status(200).json({ commissions });
// }
// pages/api/reports/commission.js

import dbConnect from '../../../lib/mongodb';
import CommissionTransaction from '../../../models/Commission';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const { page = 1, limit = 10, search = '', platform = '', payoutStatus = '', fromDate, toDate } = req.query;

    const filters = {};

    if (platform) filters.platform = platform;
    if (payoutStatus) filters.payoutStatus = payoutStatus;
    if (fromDate && toDate) {
      filters.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    if (search) {
      filters.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const total = await CommissionTransaction.countDocuments(filters);
    const transactions = await CommissionTransaction.find(filters)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ transactions, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    console.error('Commission Report Fetch Error:', error);
    res.status(500).json({ message: 'Server error while fetching commission report.' });
  }
};
