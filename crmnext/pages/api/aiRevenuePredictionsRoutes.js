// routes/aiRevenuePredictionsRoutes.js
const express = require("express");
const { getRevenuePredictions } = require("../controllers/aiRevenuePredictionsController");
const router = express.Router();

router.get("/", getRevenuePredictions);

module.exports = router;
