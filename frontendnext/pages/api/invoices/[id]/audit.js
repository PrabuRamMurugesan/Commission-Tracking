import { getAuditLog } from "../../../../controllers/invoiceController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAuditLog(req, res);
  }
  res.setHeader("Allow", ["GET"]);
  return res
    .status(405)
    .json({ success: false, error: `Method ${req.method} not allowed` });
}
