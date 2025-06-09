// routes/aiSmartChatAssistantRoutes.js
const express = require("express");
const { chatWithAI } = require("../controllers/aiSmartChatAssistantController");
const router = express.Router();

router.post("/", chatWithAI);

module.exports = router;
