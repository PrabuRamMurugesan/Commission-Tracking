// routes/aiLoadBalancerRoutes.js
const express = require("express");
const { getLoadMetrics, balanceLoad } = require("../controllers/aiLoadBalancerController");
const router = express.Router();

router.get("/", getLoadMetrics);
router.post("/balance", balanceLoad);

module.exports = router;
