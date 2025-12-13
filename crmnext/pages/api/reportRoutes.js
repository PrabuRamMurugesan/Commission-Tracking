// const express = require('express');
// const Sale = require('../models/Sale');
// const Commission = require('../models/Commission');
// const Transaction = require('../models/Transaction');
// const router = express.Router();
// const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
// const { getSalesReport, getPayoutReport, getCommissionReport } = require('../controllers/reportController');

// // Sales Report
// router.get('/sales', async (req, res) => {
//   try {
//     const sales = await Sale.find().populate('agentId customerId', 'name email');
//     res.status(200).json(sales);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching sales report', error });
//   }
// });

// // ✅ Route for sales reports
// router.get('/sales', getSalesReport);

// // ✅ Route for commission reports
// router.get('/commissions', getCommissionReport);

// // Payout Report
// router.get('/payouts', verifyToken, authorizeRoles('Admin'), getPayoutReport);

// // Commission Report
// router.get('/commissions', async (req, res) => {
//   try {
//     const commissions = await Commission.find().populate('saleId agentId', 'productName commissionAmount');
//     res.status(200).json(commissions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching commissions report', error });
//   }
// });

// // Transaction Report
// router.get('/transactions', async (req, res) => {
//   try {
//     const transactions = await Transaction.find().populate('recipientId commissionId', 'name amount');
//     res.status(200).json(transactions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching transactions report', error });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getSalesReport,
  getPayoutReport,
  getCommissionReport,
  getTopPerformersReport,
} = require('../controllers/reportController');

// ✅ Route for sales reports (Detailed and aggregate sales reports)
router.get('/sales', verifyToken, authorizeRoles('Admin', 'Manager'), getSalesReport);

// ✅ Route for commission reports (Detailed and filtered commission data)
router.get('/commissions', verifyToken, authorizeRoles('Admin', 'Manager'), getCommissionReport);

// ✅ Route for top performers report (Monthly, weekly, daily top sales performers)
router.get('/top-performers', verifyToken, authorizeRoles('Admin', 'Manager'), getTopPerformersReport);

// ✅ Route for payout reports (Admin-only)
router.get('/payouts', verifyToken, authorizeRoles('Admin'), getPayoutReport);

// ✅ Route for detailed sales (specific population of sales details)
router.get('/sales/detailed', async (req, res) => {
  try {
    const sales = await Sale.find().populate('agentId customerId', 'name email');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching detailed sales report', error });
  }
});

// ✅ Route for detailed commission reports
router.get('/commissions/detailed', async (req, res) => {
  try {
    const commissions = await Commission.find().populate('saleId agentId', 'productName commissionAmount');
    res.status(200).json(commissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching detailed commission report', error });
  }
});

// ✅ Route for transaction reports
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('recipientId commissionId', 'name amount');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions report', error });
  }
});

module.exports = router;
