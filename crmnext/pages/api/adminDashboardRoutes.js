import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import dbConnect from "../../../utils/dbConnect";
import Commission from "../../../models/Commission";

router.get('/overview', async (req, res) => {
  const { db } = await connectToDatabase();
  await dbConnect(); // Ensure Database Connection
  try {
    const { startDate, endDate, agentId, productName, commissionStatus } = req.query;

    // Date filter
    const dateFilter = startDate && endDate ? {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    } : {};

    // Agent filter
    const agentFilter = agentId ? { agentId: new ObjectId(agentId) } : {};

    // Product filter
    const productFilter = productName ? { productName: new RegExp(productName, 'i') } : {};

    // Commission status filter (if provided)
    const commissionFilter = commissionStatus ? { status: commissionStatus } : {};

    // Calculate total sales based on filters
    const totalSales = await db.collection("sales").aggregate([
      { $match: { ...dateFilter, ...agentFilter, ...productFilter } },
      { $group: { _id: null, total: { $sum: "$saleAmount" } } }
    ]).toArray();

    // Count total commissions and filter pending commissions if needed
    const totalCommissions = await db.collection("commissions").countDocuments(commissionFilter);
    const pendingCommissions = await db.collection("commissions").countDocuments({ status: 'Pending' });

    // Calculate total payouts
    const totalPayouts = await db.collection("transactions").aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();

    // Find top-performing agents by total sales
    const topAgents = await db.collection("sales").aggregate([
      { $match: { ...dateFilter, ...productFilter } },
      { $group: { _id: '$agentId', totalSales: { $sum: '$saleAmount' } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]).toArray();

    const commissions = await Commission.find();

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalCommissions,
      pendingCommissions,
      totalPayouts: totalPayouts[0]?.total || 0,
      topAgents,
      commissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin overview', error });
  }
});

module.exports = router;
