// crmnext/pages/api/agents/[id].js

import {
  getAgentById,
  updateAgent,
  deleteAgent,
} from "../../../controllers/Agent/agentController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAgentById(req, res);
  } else if (req.method === "PUT") {
    return updateAgent(req, res);
  } else if (req.method === "DELETE") {
    return deleteAgent(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
