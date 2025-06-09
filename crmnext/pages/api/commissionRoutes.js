// backend/routes/commissionRoutes.js

const express = require('express');
const {
  getAllCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
  calculateCommissionForTransaction,
} = require('../controllers/commissionController');

const router = express.Router();
const Commission = require("../models/Commission");

// ✅ Fetch Commission Breakdown
router.get("/commissions", async (req, res) => {
  try {
    const commissions = await Commission.find();
    res.json(commissions);
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ message: "Error retrieving commissions" });
  }
});
// GET all commissions
router.get('/', getAllCommissions);

// GET a specific commission by ID
router.get('/:id', getCommissionById);

// POST a new commission manually
router.post('/', createCommission);

// PUT to update an existing commission
router.put('/:id', updateCommission);

// DELETE a commission
router.delete('/:id', deleteCommission);

// POST to calculate commission automatically for a transaction
router.post('/calculate', calculateCommissionForTransaction);

module.exports = router;
