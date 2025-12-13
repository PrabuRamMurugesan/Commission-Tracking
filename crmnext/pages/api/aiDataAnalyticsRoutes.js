// routes/aiDataAnalyticsRoutes.js
const express = require("express");
const { getAnalyticsData } = require("../controllers/aiDataAnalyticsController");
const router = express.Router();

router.get("/", getAnalyticsData);

module.exports = router;
