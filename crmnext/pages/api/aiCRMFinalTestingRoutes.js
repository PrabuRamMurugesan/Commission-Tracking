// routes/aiCRMFinalTestingRoutes.js
const express = require("express");
const { runFinalTesting } = require("../controllers/aiCRMFinalTestingController");
const router = express.Router();

router.get("/", runFinalTesting);

module.exports = router;
