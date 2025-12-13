// routes/aiSecurityMonitorRoutes.js
const express = require("express");
const { getSecurityLogs, triggerSecurityScan } = require("../controllers/aiSecurityMonitorController");
const router = express.Router();

router.get("/", getSecurityLogs);
router.post("/scan", triggerSecurityScan);

module.exports = router;
