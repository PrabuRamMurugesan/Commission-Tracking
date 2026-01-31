// models/AuditLogs.js
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AuditLogs ||
  mongoose.model("AuditLogs", auditSchema);
