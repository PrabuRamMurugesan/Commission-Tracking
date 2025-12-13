// routes/aiTransactionFraudDetectionRoutes.js
const express = require("express");
const { getFraudulentTransactions } = require("../controllers/aiTransactionFraudDetectionController");
const router = express.Router();

router.get("/", getFraudulentTransactions);

module.exports = router;
