import dbConnect from "../../../lib/mongodb";
import { getTransactionReport } from "../../../controllers/reports/transactionReportController";
import { authMiddleware } from "../../../middleware/authMiddleware";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    authMiddleware()(req, res, () => getTransactionReport(req, res));
} else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
