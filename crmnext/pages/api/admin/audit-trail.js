// pages/api/admin/audit-trail.js
import { connectDB } from "../../../lib/db";
import AuditLogs from "../../../models/AuditLogs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const logs = await AuditLogs.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(); // Return plain JS objects

      res.status(200).json({ success: true, logs });
    } catch (err) {
      console.error("Audit trail error:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch audit logs" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
