// routes/commissionCalculatorRoutes.js
const express = require("express");
const { calculateCommission } = require("../controllers/commissionCalculatorController");
const router = express.Router();

router.post("/", calculateCommission);

module.exports = router;
