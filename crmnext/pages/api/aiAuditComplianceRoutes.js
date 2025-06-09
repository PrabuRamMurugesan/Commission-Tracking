// routes/aiAuditComplianceRoutes.js
const express = require("express");
const { getAuditReports, initiateAudit } = require("../controllers/aiAuditComplianceController");
const router = express.Router();

router.get("/", getAuditReports);
router.post("/initiate", initiateAudit);

module.exports = router;
