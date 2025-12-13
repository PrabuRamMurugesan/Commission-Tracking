
import dbConnect from '../../../utils/dbconnect';
import Franchisee from '../../../models/Franchise';
import TerritoryHead from '../../../models/TerritoryHead';
import Agent from '../../../models/Agent';
import Customer from '../../../models/Customer';
import Transaction from '../../../models/Transaction';
import Commission from '../../../models/Commission';
import Payout from '../../../models/CommissionPayout';
import Sale from '../../../models/Sale';


export default async function handler(req, res) {
  await dbConnect();

  try {
    // Get Franchisee ID from session or query
    const franchiseeId = req.query.id;

    if (!franchiseeId) {
      return res.status(400).json({ success: false, message: "Franchisee ID missing" });
    }

    // 1. Fetch Territory Heads under Franchisee
    const territoryHeads = await TerritoryHead.find({ franchisee: franchiseeId });

    // 2. Fetch Agents under those Territory Heads
    const territoryHeadIds = territoryHeads.map(th => th._id);
    const agents = await Agent.find({ territoryHead: { $in: territoryHeadIds } });

    // 3. Fetch Customers under those Agents
    const agentIds = agents.map(agent => agent._id);
    const customers = await Customer.find({ agent: { $in: agentIds } });

    // 4. Fetch Transactions made by those Customers
    const customerIds = customers.map(customer => customer._id);
    const transactions = await Transaction.find({ customer: { $in: customerIds } });

    // 5. Fetch Commission Data
    const commissions = await Commission.find({ franchisee: franchiseeId });

    // 6. Fetch Sales Data
    const sales = await Sale.find({ franchisee: franchiseeId });

    // 7. Fetch Payout Data
    const payouts = await Payout.find({ franchisee: franchiseeId });

    // Totals and Summary Calculations
    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);
    const pendingCommission = commissions
      .filter(c => c.status === 'Pending')
      .reduce((sum, c) => sum + c.amount, 0);
    const totalWithdrawn = payouts
      .filter(p => p.status === 'Approved')
      .reduce((sum, p) => sum + p.amount, 0);

    // Prepare JSON Response
    res.status(200).json({
      success: true,
      totalSales,
      totalCommission,
      pendingCommission,
      totalWithdrawn,
      territoryHeadsCount: territoryHeads.length,
      agentsCount: agents.length,
      vendorsCount: 0, // Update if Vendor model is included
      customersCount: customers.length,

      territoryHeadsList: territoryHeads.map(th => ({
        name: th.name,
        email: th.email,
        assignedAgents: agents.filter(a => String(a.territoryHead) === String(th._id)).length,
        sales: sales
          .filter(s => String(s.territoryHead) === String(th._id))
          .reduce((sum, s) => sum + s.amount, 0),
        commission: commissions
          .filter(c => String(c.territoryHead) === String(th._id))
          .reduce((sum, c) => sum + c.amount, 0),
      })),

      agentsList: agents.map(agent => ({
        name: agent.name,
        territoryHead:
          territoryHeads.find(th => String(th._id) === String(agent.territoryHead))?.name || '',
        customers: customers.filter(c => String(c.agent) === String(agent._id)).length,
        sales: sales
          .filter(s => String(s.agent) === String(agent._id))
          .reduce((sum, s) => sum + s.amount, 0),
        commission: commissions
          .filter(c => String(c.agent) === String(agent._id))
          .reduce((sum, c) => sum + c.amount, 0),
      })),

      customerList: customers.map(customer => ({
        name: customer.name,
        agent: agents.find(a => String(a._id) === String(customer.agent))?.name || '',
        lastPurchase: transactions
          .filter(t => String(t.customer) === String(customer._id))
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date || null,
        transactionCount: transactions.filter(t => String(t.customer) === String(customer._id)).length,
        totalSpent: transactions
          .filter(t => String(t.customer) === String(customer._id))
          .reduce((sum, t) => sum + t.amount, 0),
      })),

      transactionList: transactions.map(t => ({
        id: t._id,
        customer: customers.find(c => String(c._id) === String(t.customer))?.name || '',
        amount: t.amount,
        date: t.date,
        status: t.status,
        source: t.source,
      })),
    });

  } catch (error) {
    console.error("Franchisee Dashboard Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}





// import dbConnect from '../../../utils/dbconnect';
// // import franchisee from '../../../models/Franchise';
// import TerritoryHead from '../../../models/TerritoryHead';
// import Agent from '../../../models/Agent';
// import Customer from '../../../models/Customer';
// import Transaction from '../../../models/Transaction';
// import Commission from '../../../models/Commission';
// import Payout from '../../../models/CommissionPayout';
// import Sale from '../../../models/Sale';

// export default async function handler(req, res) {
//   await dbConnect();

//   try {
//     // Get Franchisee ID from session or query
//     const franchiseeId = req.query.id; // Pass this via frontend

//     if (!franchiseeId) {
//       return res.status(400).json({ success: false, message: "Franchisee ID missing" });
//     }

//     // 1. Fetch Territory Heads under Franchisee
//     const territoryHeads = await TerritoryHead.find({ franchisee: franchiseeId });

//     // 2. Fetch Agents under those Territory Heads
//     const territoryHeadIds = territoryHeads.map(th => th._id);
//     const agents = await Agent.find({ territoryHead: { $in: territoryHeadIds } });

//     // 3. Fetch Customers under those Agents
//     const agentIds = agents.map(agent => agent._id);
//     const customers = await Customer.find({ agent: { $in: agentIds } });

//     // 4. Fetch Transactions made by those Customers
//     const customerIds = customers.map(customer => customer._id);
//     const transactions = await Transaction.find({ customer: { $in: customerIds } });

//     // 5. Fetch Commission Data
//     const commissions = await Commission.find({ franchisee: franchiseeId });

//     // 6. Fetch Sales Data
//     const sales = await Sale.find({ franchisee: franchiseeId });

//     // 7. Fetch Payout Data
//     const payouts = await Payout.find({ franchisee: franchiseeId });

//     // Totals and Summary Calculations
//     const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
//     const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);
//     const pendingCommission = commissions.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0);
//     const totalWithdrawn = payouts.filter(p => p.status === 'Approved').reduce((sum, p) => sum + p.amount, 0);

//     res.status(200).json({
//       success: true,
//       totalSales,
//       totalCommission,
//       pendingCommission,
//       totalWithdrawn,
//       territoryHeadsCount: territoryHeads.length,
//       agentsCount: agents.length,
//       vendorsCount: 0, // Optional - if Vendor model is used
//       customersCount: customers.length,
//       territoryHeadsList: territoryHeads.map(th => ({
//         name: th.name,
//         email: th.email,
//         assignedAgents: agents.filter(a => String(a.territoryHead) === String(th._id)).length,
//         sales: sales.filter(s => String(s.territoryHead) === String(th._id)).reduce((sum, s) => sum + s.amount, 0),
//         commission: commissions.filter(c => String(c.territoryHead) === String(th._id)).reduce((sum, c) => sum + c.amount, 0),
//       })),
//       agentsList: agents.map(agent => ({
//         name: agent.name,
//         territoryHead: territoryHeads.find(th => String(th._id) === String(agent.territoryHead))?.name || '',
//         customers: customers.filter(c => String(c.agent) === String(agent._id)).length,
//         sales: sales.filter(s => String(s.agent) === String(agent._id)).reduce((sum, s) => sum + s.amount, 0),
//         commission: commissions.filter(c => String(c.agent) === String(agent._id)).reduce((sum, c) => sum + c.amount, 0),
//       })),
//       customerList: customers.map(customer => ({
//         name: customer.name,
//         agent: agents.find(a => String(a._id) === String(customer.agent))?.name || '',
//         lastPurchase: transactions.find(t => String(t.customer) === String(customer._id))?.date || null,
//         transactionCount: transactions.filter(t => String(t.customer) === String(customer._id)).length,
//         totalSpent: transactions.filter(t => String(t.customer) === String(customer._id)).reduce((sum, t) => sum + t.amount, 0),
//       })),
//       transactionList: transactions.map(t => ({
//         id: t._id,
//         customer: customers.find(c => String(c._id) === String(t.customer))?.name || '',
//         amount: t.amount,
//         date: t.date,
//         status: t.status,
//         source: t.source,
//       })),
//     });

//   } catch (error) {
//     console.error("Franchisee Dashboard Error:", error);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// }
