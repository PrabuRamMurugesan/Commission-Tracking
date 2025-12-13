// routes/predictiveMarketingRoutes.js
const express = require("express");
const { getPredictiveMarketingData } = require("../controllers/predictiveMarketingController");
const router = express.Router();

router.get("/", getPredictiveMarketingData);

module.exports = router;
