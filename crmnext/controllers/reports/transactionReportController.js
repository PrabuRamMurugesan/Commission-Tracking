import { Transaction } from "../../models/Transaction";

export const getTransactionReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      platform,
      userRole,
      paymentMethod,
      transactionType,
      transactionCategory,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (platform) query.platform = platform;
    if (userRole) query.userRole = userRole;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (transactionType) query.transactionType = transactionType;
    if (transactionCategory) query.transactionCategory = transactionCategory;

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { userPhone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      transactions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("❌ Transaction Report Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
