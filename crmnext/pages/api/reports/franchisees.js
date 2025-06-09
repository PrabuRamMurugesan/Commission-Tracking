// pages/api/reports/franchisees.js
import dbConnect from "../../../lib/mongodb";
import { getFranchiseeReports } from "../../../controllers/reports/franchiseeReportController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    return getFranchiseeReports(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
