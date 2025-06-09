// routes/aiSystemHealthMonitorRoutes.js
const express = require("express");
const { getSystemHealth, optimizeSystem } = require("../controllers/aiSystemHealthMonitorController");
const router = express.Router();

router.get("/", getSystemHealth);
router.post("/optimize", optimizeSystem);

module.exports = router;
