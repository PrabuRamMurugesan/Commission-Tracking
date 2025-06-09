// routes/aiAutoResourceAllocationRoutes.js
const express = require("express");
const { getResourceData, toggleAutoAllocation } = require("../controllers/aiAutoResourceAllocationController");
const router = express.Router();

router.get("/", getResourceData);
router.post("/toggle", toggleAutoAllocation);

module.exports = router;
