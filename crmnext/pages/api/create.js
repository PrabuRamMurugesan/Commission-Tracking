// pages/api/agent/create.js
import dbConnect from "../../lib/mongodb";
import { createAgents } from "../../controllers/Agent/agentController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    return createAgents(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
