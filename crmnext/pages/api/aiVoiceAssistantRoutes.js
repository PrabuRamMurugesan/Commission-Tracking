// routes/aiVoiceAssistantRoutes.js
const express = require("express");
const { getVoiceResponse } = require("../controllers/aiVoiceAssistantController");
const router = express.Router();

router.post("/", getVoiceResponse);

module.exports = router;
