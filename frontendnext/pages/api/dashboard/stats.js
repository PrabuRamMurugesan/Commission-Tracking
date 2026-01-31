import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Transaction from "../../../models/Transaction";
import Commission from "../../../models/Commission";
import Sale from "../../../models/Sale";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const totalUsers = await User.countDocuments().catch(() => 0);
    const totalTransactions = await Transaction.countDocuments().catch(() => 0);
    let totalCommissions = 0;
    try {
      const result = await Commission.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
      totalCommissions = result.length > 0 ? result[0].total : 0;
    } catch (_) {}
    const sales = await Sale.find({}).sort({ date: -1 }).limit(10).lean().catch(() => []);

    return res.status(200).json({
      success: true,
      users: totalUsers,
      transactions: totalTransactions,
      commissions: totalCommissions,
      sales,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
