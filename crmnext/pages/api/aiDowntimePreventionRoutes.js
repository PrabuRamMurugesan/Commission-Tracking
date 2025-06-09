// routes/aiDowntimePreventionRoutes.js
const express = require("express");
const { getDowntimeData, triggerPreventiveAction } = require("../controllers/aiDowntimePreventionController");
const router = express.Router();

router.get("/", getDowntimeData);
router.post("/trigger", triggerPreventiveAction);

module.exports = router;
