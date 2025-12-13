// routes/aiCloudCostOptimizationRoutes.js
const express = require("express");
const { getCostData } = require("../controllers/aiCloudCostOptimizationController");
const router = express.Router();

router.get("/", getCostData);

module.exports = router;
