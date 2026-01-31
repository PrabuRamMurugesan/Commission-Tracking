const { Transaction } = require("../../models/Transaction");

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
      limit = 100, // Increased default limit to show more transactions
    } = req.query;

    const query = {};

    // Date filter - default to last 30 days if no dates provided
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

    if (platform) query.platform = platform;
    if (userRole) query.sellerRole = userRole; // Transaction schema uses sellerRole, not userRole
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (transactionType) query.transactionType = transactionType;
    if (transactionCategory) query.transactionCategory = transactionCategory;

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
        { buyerName: { $regex: search, $options: "i" } },
        { buyerPhone: { $regex: search, $options: "i" } },
        { sellerName: { $regex: search, $options: "i" } },
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
