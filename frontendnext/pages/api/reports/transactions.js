// crmnext/pages/api/reports/transactions.js
import dbConnect from "../../../lib/mongodb";
import { getTransactionReport } from "../../../controllers/reports/transactionReportController";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
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
