// routes/aiTrafficLoadBalancingRoutes.js
const express = require("express");
const { getTrafficData } = require("../controllers/aiTrafficLoadBalancingController");
const router = express.Router();

router.get("/", getTrafficData);

module.exports = router;
