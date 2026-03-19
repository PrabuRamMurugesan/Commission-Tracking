// pages/api/reports/Territory-HeadReport.js
import dbConnect from "../../../lib/mongodb";
import { getAllTerritory } from "../../../controllers/Territory/territoryHeadController";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
 if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await dbConnect();
    // Use the same controller as /api/territory which fetches from both CRM and BBSCART
    await getAllTerritory(req, res);
  } catch (error) {
    console.error("Territory Head Report API Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}

export default allowCors(handler);