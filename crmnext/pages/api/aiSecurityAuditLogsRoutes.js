// routes/aiSecurityAuditLogsRoutes.js
const express = require("express");
const { getAuditLogs } = require("../controllers/aiSecurityAuditLogsController");
const router = express.Router();

router.get("/", getAuditLogs);

module.exports = router;
