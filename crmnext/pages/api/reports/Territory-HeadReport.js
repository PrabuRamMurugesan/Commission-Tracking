// pages/api/reports/Territory-HeadReport.js
import dbConnect from "../../../lib/mongodb";
import { getAllTerritoryHeads } from "../../../controllers/reports/Territory-HeadReport";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const data = await getAllTerritoryHeads();
    res.status(200).json({ success: true, territories: data });
  } catch (error) {
    console.error("Territory Head Report error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
