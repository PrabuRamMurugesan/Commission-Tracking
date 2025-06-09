// routes/aiSalesPredictorRoutes.js
const express = require("express");
const { getSalesPredictions } = require("../controllers/aiSalesPredictorController");
const router = express.Router();

router.get("/", getSalesPredictions);

module.exports = router;
