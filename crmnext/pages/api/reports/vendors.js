// pages/api/reports/vendors.js
import dbConnect from "../../../lib/mongodb";
import { getAllVendor } from "../../../controllers/Vendor/vendorController";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

   if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    // Use the same controller as /api/vendor which fetches from both CRM and BBSCART
    await getAllVendor(req, res);
  } catch (error) {
    console.error("Vendor Report API Error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}

export default allowCors(handler);