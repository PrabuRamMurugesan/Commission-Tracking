// routes/aiAutoScalingRoutes.js
const express = require("express");
const { getScalingMetrics, triggerAutoScaling } = require("../controllers/aiAutoScalingController");
const router = express.Router();

router.get("/", getScalingMetrics);
router.post("/trigger", triggerAutoScaling);

module.exports = router;
