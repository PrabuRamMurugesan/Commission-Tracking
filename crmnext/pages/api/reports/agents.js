// pages/api/reports/agents.js
import dbConnect from "../../../lib/mongodb";
import { getAllAgents } from "../../../controllers/reports/agentController";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const agents = await getAllAgents();
    return res.status(200).json({ success: true, agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}
