// routes/aiAutomatedExpenseTrackingRoutes.js
const express = require("express");
const { getExpenseTrackingData } = require("../controllers/aiAutomatedExpenseTrackingController");
const router = express.Router();

router.get("/", getExpenseTrackingData);

module.exports = router;
