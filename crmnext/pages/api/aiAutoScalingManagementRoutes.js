// routes/aiAutoScalingManagementRoutes.js
const express = require("express");
const { getScalingData, toggleAutoScaling } = require("../controllers/aiAutoScalingManagementController");
const router = express.Router();

router.get("/", getScalingData);
router.post("/toggle", toggleAutoScaling);

module.exports = router;
