// routes/aiBugDetectionRoutes.js
const express = require("express");
const { getBugReports } = require("../controllers/aiBugDetectionController");
const router = express.Router();

router.get("/", getBugReports);

module.exports = router;
