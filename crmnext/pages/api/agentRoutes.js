import dbConnect from "../../../utils/dbConnect";
import Vendor from "../../models/Vendor/Vendor";
import Commission from "../../models/Commission";
import { getAllAgents, getAgentById, createAgent, updateAgent, deleteAgent } from "../../controllers/Agent/agentController";

export default async function handler(req, res) {
  await dbConnect(); // Ensure Database Connection

  const { method, query } = req;

  if (method === "GET" && query.type === "vendors") {
    try {
      const vendors = await Vendor.find();
      return res.status(200).json(vendors);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving vendors", error });
    }
  }

  if (method === "GET" && query.type === "commissions") {
    try {
      const commissions = await Commission.find();
      return res.status(200).json(commissions);
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  switch (method) {
    case "GET":
      if (query.id) {
        await getAgentById(req, res);
      } else {
        await getAllAgents(req, res);
      }
      break;
    case "POST":
      await createAgent(req, res);
      break;
    case "PUT":
      await updateAgent(req, res);
      break;
    case "DELETE":
      await deleteAgent(req, res);
      break;
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
