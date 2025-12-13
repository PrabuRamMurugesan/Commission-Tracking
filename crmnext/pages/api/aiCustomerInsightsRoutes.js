// routes/aiCustomerInsightsRoutes.js
const express = require("express");
const { getCustomerInsights } = require("../controllers/aiCustomerInsightsController");
const router = express.Router();

router.get("/", getCustomerInsights);

module.exports = router;
