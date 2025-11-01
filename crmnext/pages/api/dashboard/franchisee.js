
// import dbConnect from '../../../utils/dbconnect';
// import Franchisee from '../../../models/Franchise';
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
//     const franchiseeId = req.query.id;

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
//     const pendingCommission = commissions
//       .filter(c => c.status === 'Pending')
//       .reduce((sum, c) => sum + c.amount, 0);
//     const totalWithdrawn = payouts
//       .filter(p => p.status === 'Approved')
//       .reduce((sum, p) => sum + p.amount, 0);

//     // Prepare JSON Response
//     res.status(200).json({
//       success: true,
//       totalSales,
//       totalCommission,
//       pendingCommission,
//       totalWithdrawn,
//       territoryHeadsCount: territoryHeads.length,
//       agentsCount: agents.length,
//       vendorsCount: 0, // Update if Vendor model is included
//       customersCount: customers.length,

//       territoryHeadsList: territoryHeads.map(th => ({
//         name: th.name,
//         email: th.email,
//         assignedAgents: agents.filter(a => String(a.territoryHead) === String(th._id)).length,
//         sales: sales
//           .filter(s => String(s.territoryHead) === String(th._id))
//           .reduce((sum, s) => sum + s.amount, 0),
//         commission: commissions
//           .filter(c => String(c.territoryHead) === String(th._id))
//           .reduce((sum, c) => sum + c.amount, 0),
//       })),

//       agentsList: agents.map(agent => ({
//         name: agent.name,
//         territoryHead:
//           territoryHeads.find(th => String(th._id) === String(agent.territoryHead))?.name || '',
//         customers: customers.filter(c => String(c.agent) === String(agent._id)).length,
//         sales: sales
//           .filter(s => String(s.agent) === String(agent._id))
//           .reduce((sum, s) => sum + s.amount, 0),
//         commission: commissions
//           .filter(c => String(c.agent) === String(agent._id))
//           .reduce((sum, c) => sum + c.amount, 0),
//       })),

//       customerList: customers.map(customer => ({
//         name: customer.name,
//         agent: agents.find(a => String(a._id) === String(customer.agent))?.name || '',
//         lastPurchase: transactions
//           .filter(t => String(t.customer) === String(customer._id))
//           .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date || null,
//         transactionCount: transactions.filter(t => String(t.customer) === String(customer._id)).length,
//         totalSpent: transactions
//           .filter(t => String(t.customer) === String(customer._id))
//           .reduce((sum, t) => sum + t.amount, 0),
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





// // import dbConnect from '../../../utils/dbconnect';
// // // import franchisee from '../../../models/Franchise';
// // import TerritoryHead from '../../../models/TerritoryHead';
// // import Agent from '../../../models/Agent';
// // import Customer from '../../../models/Customer';
// // import Transaction from '../../../models/Transaction';
// // import Commission from '../../../models/Commission';
// // import Payout from '../../../models/CommissionPayout';
// // import Sale from '../../../models/Sale';

// // export default async function handler(req, res) {
// //   await dbConnect();

// //   try {
// //     // Get Franchisee ID from session or query
// //     const franchiseeId = req.query.id; // Pass this via frontend

// //     if (!franchiseeId) {
// //       return res.status(400).json({ success: false, message: "Franchisee ID missing" });
// //     }

// //     // 1. Fetch Territory Heads under Franchisee
// //     const territoryHeads = await TerritoryHead.find({ franchisee: franchiseeId });

// //     // 2. Fetch Agents under those Territory Heads
// //     const territoryHeadIds = territoryHeads.map(th => th._id);
// //     const agents = await Agent.find({ territoryHead: { $in: territoryHeadIds } });

// //     // 3. Fetch Customers under those Agents
// //     const agentIds = agents.map(agent => agent._id);
// //     const customers = await Customer.find({ agent: { $in: agentIds } });

// //     // 4. Fetch Transactions made by those Customers
// //     const customerIds = customers.map(customer => customer._id);
// //     const transactions = await Transaction.find({ customer: { $in: customerIds } });

// //     // 5. Fetch Commission Data
// //     const commissions = await Commission.find({ franchisee: franchiseeId });

// //     // 6. Fetch Sales Data
// //     const sales = await Sale.find({ franchisee: franchiseeId });

// //     // 7. Fetch Payout Data
// //     const payouts = await Payout.find({ franchisee: franchiseeId });

// //     // Totals and Summary Calculations
// //     const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
// //     const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);
// //     const pendingCommission = commissions.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0);
// //     const totalWithdrawn = payouts.filter(p => p.status === 'Approved').reduce((sum, p) => sum + p.amount, 0);

// //     res.status(200).json({
// //       success: true,
// //       totalSales,
// //       totalCommission,
// //       pendingCommission,
// //       totalWithdrawn,
// //       territoryHeadsCount: territoryHeads.length,
// //       agentsCount: agents.length,
// //       vendorsCount: 0, // Optional - if Vendor model is used
// //       customersCount: customers.length,
// //       territoryHeadsList: territoryHeads.map(th => ({
// //         name: th.name,
// //         email: th.email,
// //         assignedAgents: agents.filter(a => String(a.territoryHead) === String(th._id)).length,
// //         sales: sales.filter(s => String(s.territoryHead) === String(th._id)).reduce((sum, s) => sum + s.amount, 0),
// //         commission: commissions.filter(c => String(c.territoryHead) === String(th._id)).reduce((sum, c) => sum + c.amount, 0),
// //       })),
// //       agentsList: agents.map(agent => ({
// //         name: agent.name,
// //         territoryHead: territoryHeads.find(th => String(th._id) === String(agent.territoryHead))?.name || '',
// //         customers: customers.filter(c => String(c.agent) === String(agent._id)).length,
// //         sales: sales.filter(s => String(s.agent) === String(agent._id)).reduce((sum, s) => sum + s.amount, 0),
// //         commission: commissions.filter(c => String(c.agent) === String(agent._id)).reduce((sum, c) => sum + c.amount, 0),
// //       })),
// //       customerList: customers.map(customer => ({
// //         name: customer.name,
// //         agent: agents.find(a => String(a._id) === String(customer.agent))?.name || '',
// //         lastPurchase: transactions.find(t => String(t.customer) === String(customer._id))?.date || null,
// //         transactionCount: transactions.filter(t => String(t.customer) === String(customer._id)).length,
// //         totalSpent: transactions.filter(t => String(t.customer) === String(customer._id)).reduce((sum, t) => sum + t.amount, 0),
// //       })),
// //       transactionList: transactions.map(t => ({
// //         id: t._id,
// //         customer: customers.find(c => String(c._id) === String(t.customer))?.name || '',
// //         amount: t.amount,
// //         date: t.date,
// //         status: t.status,
// //         source: t.source,
// //       })),
// //     });

// //   } catch (error) {
// //     console.error("Franchisee Dashboard Error:", error);
// //     res.status(500).json({ success: false, message: 'Server Error' });
// //   }
// // }


// pages/api/dashboard/franchisee.js
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
  // Only allow GET for this dashboard endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  await dbConnect();

  try {
    // 1) Input: franchiseeId (from query)
    const franchiseeId = req.query.id;
    if (!franchiseeId) {
      return res.status(400).json({ success: false, message: 'Franchisee ID missing' });
    }

    // Optional pagination knobs for lists (kept simple & backward-compatible)
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const skip  = Math.max(parseInt(req.query.skip  || '0',   10), 0);

    // 2) Fetch everything in parallel (preserves your data sources and rollups)
    const [
      territoryHeads,
      commissions,
      sales,
      payouts
    ] = await Promise.all([
      TerritoryHead.find(
        { franchisee: franchiseeId },
        { name: 1, email: 1, territoryHead: 1 } // safe projection
      ).lean(),

      Commission.find(
        { franchisee: franchiseeId },
        { amount: 1, status: 1, territoryHead: 1, agent: 1 }
      ).lean(),

      Sale.find(
        { franchisee: franchiseeId },
        { amount: 1, territoryHead: 1, agent: 1 }
      ).lean(),

      Payout.find(
        { franchisee: franchiseeId },
        { amount: 1, status: 1 }
      ).lean()
    ]);

    const territoryHeadIds = territoryHeads.map(th => th._id);

    // Agents & Customers depend on territory heads → run after we have IDs
    const [agents, customers] = await Promise.all([
      Agent.find(
        { territoryHead: { $in: territoryHeadIds } },
        { name: 1, territoryHead: 1 }
      ).lean(),
      Customer.find(
        { agent: { $in: [] } }, // temp to keep pipeline structure
        { name: 1, agent: 1 }
      ).lean()
    ]);

    // Now that we have agents, reload customers with the right filter (keeps your logic intact)
    const agentIds = agents.map(a => a._id);
    const customersFiltered = agentIds.length
      ? await Customer.find({ agent: { $in: agentIds } }, { name: 1, agent: 1 }).lean()
      : [];

    // Transactions depend on customers
    const customerIds = customersFiltered.map(c => c._id);
    const transactions = customerIds.length
      ? await Transaction.find(
          { customer: { $in: customerIds } },
          { customer: 1, amount: 1, date: 1, status: 1, source: 1 }
        ).lean()
      : [];

    // 3) Totals (unchanged meaning)
    const totalSales = sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    const totalCommission = commissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const pendingCommission = commissions
      .filter(c => c.status === 'Pending')
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const totalWithdrawn = payouts
      .filter(p => p.status === 'Approved')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // 4) Helper maps (for quick lookups)
    const agentsByTH = new Map();
    for (const a of agents) {
      const key = String(a.territoryHead || '');
      if (!agentsByTH.has(key)) agentsByTH.set(key, []);
      agentsByTH.get(key).push(a);
    }

    const customersByAgent = new Map();
    for (const c of customersFiltered) {
      const key = String(c.agent || '');
      if (!customersByAgent.has(key)) customersByAgent.set(key, []);
      customersByAgent.get(key).push(c);
    }

    // 5) Lists — preserve your response shape and semantics
    const territoryHeadsList = territoryHeads.map(th => {
      const thId = String(th._id);
      const thAgents = agentsByTH.get(thId) || [];

      const thSales = sales
        .filter(s => String(s.territoryHead) === thId)
        .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

      const thCommission = commissions
        .filter(c => String(c.territoryHead) === thId)
        .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

      return {
        name: th.name || '',
        email: th.email || '',
        assignedAgents: thAgents.length,
        sales: thSales,
        commission: thCommission
      };
    });

    const agentsListAll = agents.map(agent => {
      const aId = String(agent._id);
      const th = territoryHeads.find(t => String(t._id) === String(agent.territoryHead));
      const aCustomers = customersByAgent.get(aId) || [];

      const aSales = sales
        .filter(s => String(s.agent) === aId)
        .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

      const aCommission = commissions
        .filter(c => String(c.agent) === aId)
        .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

      return {
        name: agent.name || '',
        territoryHead: th?.name || '',
        customers: aCustomers.length,
        sales: aSales,
        commission: aCommission
      };
    });

    // Apply simple paging to the long lists (keeps old default behavior)
    const agentsList = agentsListAll.slice(skip, skip + limit);

    const customerListAll = customersFiltered.map(customer => {
      const cId = String(customer._id);
      const ag = agents.find(a => String(a._id) === String(customer.agent));

      const cTransactions = transactions
        .filter(t => String(t.customer) === cId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const lastPurchase = cTransactions[0]?.date || null;
      const totalSpent = cTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      return {
        name: customer.name || '',
        agent: ag?.name || '',
        lastPurchase,
        transactionCount: cTransactions.length,
        totalSpent
      };
    });

    const customerList = customerListAll.slice(skip, skip + limit);

    const transactionListAll = transactions.map(t => ({
      id: t._id,
      customer: (customersFiltered.find(c => String(c._id) === String(t.customer))?.name) || '',
      amount: t.amount,
      date: t.date,
      status: t.status,
      source: t.source
    }));

    const transactionList = transactionListAll.slice(skip, skip + limit);

    // 6) Response — preserves your keys
    return res.status(200).json({
      success: true,
      totalSales,
      totalCommission,
      pendingCommission,
      totalWithdrawn,
      territoryHeadsCount: territoryHeads.length,
      agentsCount: agents.length,
      vendorsCount: 0, // keep as-is; wire in Vendor model later if needed
      customersCount: customersFiltered.length,

      territoryHeadsList,
      agentsList,
      customerList,
      transactionList
    });
  } catch (error) {
    console.error('Franchisee Dashboard Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}

