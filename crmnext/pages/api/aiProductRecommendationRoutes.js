// routes/aiProductRecommendationRoutes.js
const express = require("express");
const { getProductRecommendations } = require("../controllers/aiProductRecommendationController");
const router = express.Router();

router.get("/", getProductRecommendations);

module.exports = router;
