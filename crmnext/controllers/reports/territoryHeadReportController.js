import TerritoryHeadReport from "../../models/TerritoryHeadReport";
import connectDB from "../../lib/mongodb";

// @desc   Get all territory head reports
// @route  GET /api/reports/territory-heads
export async function getTerritoryHeadReports(req, res) {
  await connectDB();

  try {
    const data = await TerritoryHeadReport.find().sort({ createdAt: -1 });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No records found." });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching Territory Head Reports:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
