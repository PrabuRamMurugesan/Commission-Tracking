// routes/aiCustomerRetentionRoutes.js
const express = require("express");
const { getCustomerRetention } = require("../controllers/aiCustomerRetentionController");
const router = express.Router();

router.get("/", getCustomerRetention);

module.exports = router;
