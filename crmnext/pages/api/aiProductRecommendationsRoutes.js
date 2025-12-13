// routes/aiProductRecommendationsRoutes.js
const express = require("express");
const { getRecommendations } = require("../controllers/aiProductRecommendationsController");
const router = express.Router();

router.get("/", getRecommendations);

module.exports = router;
