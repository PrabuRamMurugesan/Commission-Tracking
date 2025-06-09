import dbConnect from "../../../utils/dbConnect";
import AgentTransactions from "../../../models/AgentTransactions";

export default async function handler(req, res) {
  await dbConnect(); // Ensure Database Connection

  const { method, query } = req;

  if (method === "GET" && query.type === "agent-transactions") {
    try {
      const transactions = await AgentTransactions.find();
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving transactions", error });
    }
  }

  if (method === "POST" && query.type === "agent-request-payout") {
    try {
      // Logic to process payout request (e.g., update payout status in DB)
      return res.status(200).json({ message: "Payout request submitted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error processing payout request", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
