// routes/aiAutoReplyRoutes.js
const express = require("express");
const { getAutoReply } = require("../controllers/aiAutoReplyController");
const router = express.Router();

router.post("/", getAutoReply);

module.exports = router;
