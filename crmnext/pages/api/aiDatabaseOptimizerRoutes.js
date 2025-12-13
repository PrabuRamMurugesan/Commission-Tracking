// routes/aiDatabaseOptimizerRoutes.js
const express = require("express");
const { getDatabaseMetrics, optimizeDatabase } = require("../controllers/aiDatabaseOptimizerController");
const router = express.Router();

router.get("/", getDatabaseMetrics);
router.post("/optimize", optimizeDatabase);

module.exports = router;
