// routes/automatedCustomerSupportAIRoutes.js
const express = require("express");
const { getAIResponse } = require("../controllers/automatedCustomerSupportAIController");
const router = express.Router();

router.post("/", getAIResponse);

module.exports = router;
