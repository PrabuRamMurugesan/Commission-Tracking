// pages/api/reports/agents.js
import dbConnect from "../../../lib/mongodb";
import { getAllAgents } from "../../../controllers/Agent/agentController";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    // Use the same controller as /api/agents which fetches from both CRM and BBSCART
    await getAllAgents(req, res);
  } catch (error) {
    console.error("Agents Report API Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}

export default allowCors(handler);
