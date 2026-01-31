import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import Transaction from "../../../models/Transaction";
import Commission from "../../../models/Commission";
import Sale from "../../../models/Sale";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Fetch dashboard stats
      const totalUsers = await User.countDocuments();
      const totalTransactions = await Transaction.countDocuments();
      const totalCommissions = await Commission.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
      const sales = await Sale.find({}).sort({ date: -1 }).limit(10);

      res.status(200).json({
        success: true,
        users: totalUsers,
        transactions: totalTransactions,
        commissions: totalCommissions.length > 0 ? totalCommissions[0].total : 0,
        sales,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
