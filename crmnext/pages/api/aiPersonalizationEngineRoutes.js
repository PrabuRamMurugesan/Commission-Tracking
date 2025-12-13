// routes/aiPersonalizationEngineRoutes.js
const express = require("express");
const { getPersonalizedRecommendations } = require("../controllers/aiPersonalizationEngineController");
const router = express.Router();

router.get("/", getPersonalizedRecommendations);

module.exports = router;
