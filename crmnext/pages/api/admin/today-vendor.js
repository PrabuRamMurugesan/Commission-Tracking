import connectDB from "../../../lib/db";
import VendorCustomerRotation from "../../../models/VendorCustomerRotation.js";
import { verifyAdmin } from "../../../middleware/roleMiddleware";

export default async function handler(req, res) {
  await connectDB();
  await verifyAdmin(req, res);

  if (req.method === "GET") {
    try {
      const { customerId, gridCode } = req.query;
      const today = new Date().toISOString().slice(0, 10);

      const record = await VendorCustomerRotation.findOne({
        customerId,
        gridCode,
        date: today,
      }).populate("selectedVendorId", "name");

      res
        .status(200)
        .json({ success: true, vendor: record?.selectedVendorId || null });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
