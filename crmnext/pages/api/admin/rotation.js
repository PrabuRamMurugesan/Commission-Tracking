import connectDB from "../../../lib/db";
import { verifyAdmin } from "../../../middleware/roleMiddleware";
import { assignVendorToGrid } from "../../../controllers/rotationController";

export default async function handler(req, res) {
  await connectDB();
  await verifyAdmin(req, res);

  if (req.method === "POST") {
    try {
      const { gridCode, date, selectedVendorId, manuallyOverridden } = req.body;

      const entry = await assignVendorToGrid(
        gridCode,
        date,
        selectedVendorId,
        manuallyOverridden
      );
      res.status(200).json({ success: true, entry });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
