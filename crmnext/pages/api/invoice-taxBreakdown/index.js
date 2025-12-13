import dbConnect from "../../../lib/mongodb";
import { getTaxRows, createTaxRow } from "../../../controllers/taxBreakdownController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    return getTaxRows(req, res);
  }
  if (req.method === "POST") {
    return createTaxRow(req, res);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
