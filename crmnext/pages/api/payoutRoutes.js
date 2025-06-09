const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Commission = require('../models/Commission');
const { createPayout, processPayout, getPayouts } = require('../controllers/payoutController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const Payout = require("../models/Payout");
const router = express.Router();


router.get("/payouts", getPayouts);
// check: Secure POST: Process payouts (Agents, Franchisees, Admins) 
router.post(
   '/create', 
   verifyToken, 
   authorizeRoles('Admin', 'Agent', 'Franchisee','Finance' ),
    processPayout 
  );
  

// Create a transaction and mark commission as paid
router.post('/create', async (req, res) => {
  try {
    const {
      recipientId,
      commissionId,
      amount,
      paymentMethod,
      paymentReference,
      bankDetails
    } = req.body;

      //-------
      router.post('/create', verifyToken, authorizeRoles('Admin'), createPayout);
      //-------


    // Convert IDs to ObjectId type
    const convertedCommissionId = mongoose.Types.ObjectId(commissionId);
    const convertedRecipientId = mongoose.Types.ObjectId(recipientId);

    // Create a new transaction
    const newTransaction = new Transaction({
      recipientId: convertedRecipientId,
      commissionId: convertedCommissionId,
      amount,
      currency: 'INR',
      paymentMethod,
      paymentReference: paymentReference || 'N/A',
      bankDetails: bankDetails || {},
      status: 'Completed',
      payoutDate: new Date()
    });

    await newTransaction.save();

    // Update the commission status to 'Paid'
    await Commission.findByIdAndUpdate(convertedCommissionId, { status: 'Paid' });

    res.status(201).json({
      message: 'Transaction completed and commission marked as paid',
      transaction: newTransaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// ✅ Get All Payouts
router.get("/payouts", async (req, res) => {
  try {
    const payouts = await Payout.find().sort({ date: -1 });
    res.json(payouts);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    res.status(500).json({ message: "Error retrieving payouts" });
  }
});

// ✅ Add New Payout
router.post("/payouts", async (req, res) => {
  try {
    const { recipient, role, amount, status, method } = req.body;

    const newPayout = new Payout({
      recipient,
      role,
      amount,
      status: "Pending",
      method,
      date: new Date(),
    });

    await newPayout.save();
    res.status(201).json({ message: "Payout recorded successfully" });
  } catch (error) {
    console.error("Error adding payout:", error);
    res.status(500).json({ message: "Error processing payout" });
  }
});

// ✅ Update Payout Status
router.put("/payouts/:id", async (req, res) => {
  try {
    const updatedPayout = await Payout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPayout);
  } catch (error) {
    console.error("Error updating payout:", error);
    res.status(500).json({ message: "Error updating payout status" });
  }
});


module.exports = router;
