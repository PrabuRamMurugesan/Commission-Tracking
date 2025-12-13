// routes/aiVideoCallRoutes.js
const express = require("express");
const { handleVideoCall } = require("../controllers/aiVideoCallController");
const router = express.Router();

router.post("/", handleVideoCall);

module.exports = router;
