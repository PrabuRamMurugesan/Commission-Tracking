// routes/aiResourceAllocatorRoutes.js
const express = require("express");
const { getResourceMetrics, optimizeResources } = require("../controllers/aiResourceAllocatorController");
const router = express.Router();

router.get("/", getResourceMetrics);
router.post("/optimize", optimizeResources);

module.exports = router;
