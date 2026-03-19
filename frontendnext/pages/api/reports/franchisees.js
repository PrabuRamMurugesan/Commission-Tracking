// pages/api/reports/franchisees.js
import dbConnect from "../../../lib/mongodb";
import { getAllFranchises } from "../../../controllers/Franchise/franchiseController";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

 if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    // Use the same controller as /api/franchise which fetches from both CRM and BBSCART
    await getAllFranchises(req, res);
  } catch (error) {
    console.error("Franchisee Report API Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}

export default allowCors(handler);