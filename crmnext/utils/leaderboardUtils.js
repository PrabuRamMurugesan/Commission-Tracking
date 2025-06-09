const Transaction = require("../models/Transaction");
const User = require("../models/User");

async function calculateLeaderboard(period = "monthly", startDate, endDate) {
  let filter = {};

  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else {
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
  }

  // Aggregate sales & commissions
  const leaderboard = await Transaction.aggregate([
    { $match: filter },
    { $group: { _id: "$userId", totalSales: { $sum: "$amount" }, totalCommission: { $sum: "$commission" } } },
    { $sort: { totalSales: -1 } }, // Sort by highest sales
    { $limit: 10 }, // Top 10 performers
  ]);

  const users = await User.find({ _id: { $in: leaderboard.map((entry) => entry._id) } });

  return leaderboard.map((entry) => {
    const user = users.find((u) => u._id.equals(entry._id));
    return {
      name: user ? user.name : "Unknown User",
      role: user ? user.role : "N/A",
      totalSales: entry.totalSales,
      totalCommission: entry.totalCommission,
    };
  });
}

module.exports = { calculateLeaderboard };
