// routes/aiAutomationSuiteRoutes.js
const express = require("express");
const { getAutomations, createAutomation } = require("../controllers/aiAutomationSuiteController");
const router = express.Router();

router.get("/", getAutomations);
router.post("/", createAutomation);

module.exports = router;
