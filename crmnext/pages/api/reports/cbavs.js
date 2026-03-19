// pages/api/reports/cbavs.js
import dbConnect from "../../../lib/mongodb";
import { getAllCbv } from "../../../controllers/Cbv/cbvController";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    // Use the same controller as /api/cbav which fetches from both CRM and BBSCART
    await getAllCbv(req, res);
  } catch (error) {
    console.error("CBAV Report API Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}

export default allowCors(handler);