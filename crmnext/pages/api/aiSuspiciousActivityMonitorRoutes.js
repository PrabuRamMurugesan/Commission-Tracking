// routes/aiSuspiciousActivityMonitorRoutes.js
const express = require("express");
const { getSuspiciousActivities, resolveSuspiciousActivity } = require("../controllers/aiSuspiciousActivityMonitorController");
const router = express.Router();

router.get("/", getSuspiciousActivities);
router.post("/resolve", resolveSuspiciousActivity);

module.exports = router;
