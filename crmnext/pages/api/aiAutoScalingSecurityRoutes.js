// routes/aiAutoScalingSecurityRoutes.js
const express = require("express");
const { getSecurityData, triggerSecurityUpgrade } = require("../controllers/aiAutoScalingSecurityController");
const router = express.Router();

router.get("/", getSecurityData);
router.post("/upgrade", triggerSecurityUpgrade);

module.exports = router;
