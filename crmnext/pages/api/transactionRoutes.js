// backend/routes/transactionRoutes.js

const express = require('express');
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();
const Transaction = require("../models/Transaction");

// ✅ Fetch Transactions
router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
});

// GET all transactions
router.get('/', getAllTransactions);

// GET a specific transaction by ID
router.get('/:id', getTransactionById);

// POST a new transaction
router.post('/', createTransaction);

// PUT to update an existing transaction
router.put('/:id', updateTransaction);

// DELETE a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
