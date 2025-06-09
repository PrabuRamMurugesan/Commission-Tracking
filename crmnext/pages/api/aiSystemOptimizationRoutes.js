// routes/aiSystemOptimizationRoutes.js
const express = require("express");
const { optimizeSystem } = require("../controllers/aiSystemOptimizationController");
const router = express.Router();

router.get("/", optimizeSystem);

module.exports = router;
