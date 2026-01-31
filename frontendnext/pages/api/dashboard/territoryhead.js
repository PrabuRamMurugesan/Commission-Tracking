import dbConnect from "../../../lib/mongodb";
import Agent from "../../../models/Agent/Agent";
import Customer from "../../../models/Customer";
import Transaction from "../../../models/Transaction";

export default async function handler(req, res) {
  await dbConnect();

  const { territoryHeadId } = req.query;

  if (!territoryHeadId) {
    return res.status(400).json({ message: "Missing territoryHeadId" });
  }

  try {
    const agents = await Agent.find({ territoryHeadId });

    let allCustomers = [];
    let allTransactions = [];
    let totalSales = 0;
    let totalCommission = 0;

    for (const agent of agents) {
      const customers = await Customer.find({ agentId: agent._id });
      allCustomers.push(...customers);

      for (const customer of customers) {
        const transactions = await Transaction.find({
          customerId: customer._id,
        });
        allTransactions.push(...transactions);

        // Calculate sales and commissions
        for (const tx of transactions) {
          totalSales += tx.amount;
          totalCommission += tx.commission || 0; // Only if your model has it
        }
      }
    }

    res.status(200).json({
      agents,
      customers: allCustomers,
      transactions: allTransactions,
      totalSales,
      totalCommission,
    });
  } catch (error) {
    console.error("Territory dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
