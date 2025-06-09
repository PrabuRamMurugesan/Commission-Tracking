// crmnext/pages/api/agents/index.js

import {
  getAllAgents,
  createAgent,
} from "../../../controllers/Agent/agentController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAllAgents(req, res);
  } else if (req.method === "POST") {
    return createAgent(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
