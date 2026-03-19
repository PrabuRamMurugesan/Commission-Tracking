// crmnext/pages/api/performance/top.js
import dbConnect from "../../../lib/mongodb";
import Agent from "../../../models/Agent/Agent";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { period = "monthly" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarterly":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "half-yearly":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "annually":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Default to monthly
    }

    // Fetch all active agents and calculate their performance metrics
    // Note: This shows overall performance. In production, you might want to
    // aggregate from transaction/commission collections based on the date range
    const agents = await Agent.find({
      accountStatus: "active",
    })
      .select("name email commissionEarned totalTransactions totalCustomers")
      .sort({ commissionEarned: -1 })
      .limit(50); // Get top 50 agents

    // Transform data to match frontend expectations
    const topAgents = agents.map((agent) => {
      // Calculate conversion rate (transactions / customers, or 0 if no customers)
      const conversionRate =
        agent.totalCustomers > 0
          ? ((agent.totalTransactions / agent.totalCustomers) * 100).toFixed(2)
          : "0.00";

      // Calculate total sales (approximation: commissionEarned * 10, or use totalTransactions)
      // In production, you'd fetch actual sales from transaction collection
      const estimatedSales = agent.totalTransactions * 100; // Placeholder calculation

      return {
        name: agent.name || "Unknown Agent",
        email: agent.email || "",
        sales: estimatedSales.toFixed(2),
        commission: (agent.commissionEarned || 0).toFixed(2),
        conversionRate: conversionRate,
        totalTransactions: agent.totalTransactions || 0,
        totalCustomers: agent.totalCustomers || 0,
      };
    });

    // Sort by commission earned (descending) and return top 10
    const sortedAgents = topAgents
      .sort((a, b) => parseFloat(b.commission) - parseFloat(a.commission))
      .slice(0, 10);

    res.status(200).json(sortedAgents);
  } catch (error) {
    console.error("Error fetching top performers:", error);
    res.status(500).json({
      message: "Error fetching top performers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export default allowCors(handler);