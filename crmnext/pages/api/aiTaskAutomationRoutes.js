// routes/aiTaskAutomationRoutes.js
const express = require("express");
const { getTasks, createTask } = require("../controllers/aiTaskAutomationController");
const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);

module.exports = router;
