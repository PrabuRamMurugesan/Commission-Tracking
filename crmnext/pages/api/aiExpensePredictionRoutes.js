// routes/aiExpensePredictionRoutes.js
const express = require("express");
const { getExpensePredictions } = require("../controllers/aiExpensePredictionController");
const router = express.Router();

router.get("/", getExpensePredictions);

module.exports = router;
