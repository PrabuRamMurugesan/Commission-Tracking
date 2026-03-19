import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import Transaction from "../../../models/Transaction";
import allowsCors from "../../../middleware/allowCors";

async function handler(req, res) {
  const { userId, role } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectDB();

    if (!userId || !role) {
      return res.status(400).json({ message: "Missing userId or role" });
    }

    // Fetch based on role
    if (role === "franchise") {
      const agents = await User.find({ role: "agent", referredBy: userId });
      const vendors = await User.find({ role: "vendor", referredBy: userId });

      const agentIds = agents.map((a) => a._id);
      const vendorIds = vendors.map((v) => v._id);

      const customers = await User.find({
        role: "customer",
        referredBy: { $in: [...agentIds, ...vendorIds] },
      });

      const transactions = await Transaction.find({ franchiseeId: userId });

      return res.status(200).json({
        dashboardFor: "franchise",
        agents,
        vendors,
        customers,
        transactions,
      });
    }

    if (role === "vendor") {
      const vendor = await User.findById(userId);
      const customers = await User.find({ referredBy: userId });
      // Optional: add product/order fetch if relevant
      return res.status(200).json({
        dashboardFor: "vendor",
        vendor,
        customers,
      });
    }

    if (role === "agent") {
      const agent = await User.findById(userId);
      const customers = await User.find({ referredBy: userId });
      return res.status(200).json({
        dashboardFor: "agent",
        agent,
        customers,
      });
    }

    // Fallback if role is not handled
    return res.status(400).json({ message: "Unhandled role" });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default allowsCors(handler);