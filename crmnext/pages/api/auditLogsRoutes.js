const express = require("express");
const router = express.Router();
const AuditLogs = require("../models/AuditLogs");

// ✅ Fetch Audit Logs
router.get("/audit-logs", async (req, res) => {
  try {
    const logs = await AuditLogs.find().sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Error retrieving audit logs" });
  }
});

// ✅ Add New Audit Log Entry
router.post("/audit-logs/add", async (req, res) => {
  try {
    const { user, role, action, description } = req.body;
    const newLog = new AuditLogs({ user, role, action, description });
    await newLog.save();
    res.json({ message: "Audit log added successfully" });
  } catch (error) {
    console.error("Error adding audit log:", error);
    res.status(500).json({ message: "Failed to add audit log" });
  }
});

module.exports = router;
