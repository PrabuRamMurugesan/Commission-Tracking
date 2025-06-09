// routes/aiAutoHealingSystemRoutes.js
const express = require("express");
const { getHealingData } = require("../controllers/aiAutoHealingSystemController");
const router = express.Router();

router.get("/", getHealingData);

module.exports = router;
