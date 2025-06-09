import dbConnect from "../../../lib/mongodb";
import Vendor from "../../../models/Vendor";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const vendors = await Vendor.find(
        {},
        {
          name: 1,
          email: 1,
          phone: 1,
          platform: 1,
          role: 1,
          referredBy: 1,
          zone: 1,
          status: 1,
          walletBalance: 1,
          totalOrders: 1,
          kycStatus: 1,
          lastActive: 1,
          comments: 1,
          createdAt: 1,
          franchiseeId: 1,
        }
      ).lean();

      return res.status(200).json({ vendors });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Vendor Report Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
