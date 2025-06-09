const Transaction = require("../models/Transaction");

async function calculatePerformance(userId, period = "monthly") {
  let filter = { userId };

  const now = new Date();
  if (period === "daily") {
    filter.date = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
  } else if (period === "weekly") {
    now.setDate(now.getDate() - 7);
    filter.date = { $gte: now };
  } else if (period === "yearly") {
    now.setFullYear(now.getFullYear() - 1);
    filter.date = { $gte: now };
  } else {
    now.setMonth(now.getMonth() - 1);
    filter.date = { $gte: now };
  }

  const transactions = await Transaction.find(filter);

  let totalSales = 0;
  let totalCommission = 0;
  transactions.forEach((txn) => {
    totalSales += txn.amount;
    totalCommission += txn.commission;
  });

  return {
    period,
    totalSales,
    totalCommission,
    transactionsCount: transactions.length,
  };
}

module.exports = { calculatePerformance };
