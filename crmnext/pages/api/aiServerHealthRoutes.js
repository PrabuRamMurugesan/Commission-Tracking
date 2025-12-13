// routes/aiServerHealthRoutes.js
const express = require("express");
const { getServerHealth, refreshHealthStatus } = require("../controllers/aiServerHealthController");
const router = express.Router();

router.get("/", getServerHealth);
router.post("/refresh", refreshHealthStatus);

module.exports = router;
