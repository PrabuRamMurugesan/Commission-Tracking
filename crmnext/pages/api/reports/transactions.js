// crmnext/pages/api/reports/transactions.js
import dbConnect from "../../../lib/mongodb";
import { getTransactionReport } from "../../../controllers/reports/transactionReportController";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

   if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    await getTransactionReport(req, res);
  } catch (error) {
    console.error("Transaction Report API Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}

export default allowCors(handler);