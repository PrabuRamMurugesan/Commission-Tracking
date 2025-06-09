// pages/api/gst-reports/sales.js
import dbConnect from "../../../lib/mongodb";
import { getGstReportFromSales } from "../../../controllers/gstReportController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    return getGstReportFromSales(req, res);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
