// routes/aiDisputeResolutionRoutes.js
const express = require("express");
const { getDisputes, createDispute } = require("../controllers/aiDisputeResolutionController");
const router = express.Router();

router.get("/", getDisputes);
router.post("/", createDispute);

module.exports = router;
