// routes/aiScalabilityEnhancementsRoutes.js
const express = require("express");
const { getScalabilityData } = require("../controllers/aiScalabilityEnhancementsController");
const router = express.Router();

router.get("/", getScalabilityData);

module.exports = router;
