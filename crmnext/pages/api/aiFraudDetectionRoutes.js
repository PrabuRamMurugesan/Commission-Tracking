// routes/aiFraudDetectionRoutes.js
const express = require("express");
const { getFraudCases, resolveFraudCase } = require("../controllers/aiFraudDetectionController");
const router = express.Router();

router.get("/", getFraudCases);
router.post("/resolve", resolveFraudCase);

module.exports = router;
