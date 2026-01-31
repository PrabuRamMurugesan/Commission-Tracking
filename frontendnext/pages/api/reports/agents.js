// pages/api/reports/agents.js
import dbConnect from "../../../lib/mongodb";
import { getAllAgents } from "../../../controllers/Agent/agentController";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
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
