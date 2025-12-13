// routes/escrowPaymentsRoutes.js
const express = require("express");
const { getEscrowPayments } = require("../controllers/escrowPaymentsController");
const router = express.Router();

router.get("/", getEscrowPayments);

module.exports = router;
