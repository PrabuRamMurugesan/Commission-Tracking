import UploadLog from "../../../models/UploadLog";
import { connectDB } from "../../../lib/db";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const logs = await UploadLog.find().sort({ uploadedAt: -1 });
      return res.status(200).json({ logs });
    } catch (err) {
      console.error("Error fetching upload logs:", err);
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
