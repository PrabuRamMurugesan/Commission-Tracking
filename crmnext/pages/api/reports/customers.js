// pages/api/reports/customers.js

import dbConnect from "../../../lib/mongodb";
import { getCustomerReport } from "../../../controllers/reports/customerReportController";
import { authMiddleware } from "../../../middleware/authMiddleware";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    return authMiddleware()(req, res, () => getCustomerReport(req, res));
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
