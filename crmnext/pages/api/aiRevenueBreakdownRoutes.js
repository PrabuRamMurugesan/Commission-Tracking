// routes/aiRevenueBreakdownRoutes.js
const express = require("express");
const { getRevenueBreakdown } = require("../controllers/aiRevenueBreakdownController");
const router = express.Router();

router.get("/", getRevenueBreakdown);

module.exports = router;
