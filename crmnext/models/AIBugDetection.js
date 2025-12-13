const mongoose = require("mongoose");

const AIBugDetectionSchema = new mongoose.Schema({
  bugId: { type: String, required: true, unique: true },
  errorMessage: { type: String, required: true }, // Error description
  filePath: { type: String, required: true }, // File where the error occurred
  lineNumber: { type: Number, required: true }, // Line number in the code
  severity: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" }, // AI detects severity level
  detectedByAI: { type: Boolean, default: true }, // AI identifies issues automatically
  suggestedFix: { type: String, required: false }, // AI-recommended solution
  systemImpact: { type: String, required: false }, // AI evaluates effect on the system
  bugOccurrences: { type: Number, default: 1 }, // Tracks how many times the bug has occurred
  lastDetected: { type: Date, default: Date.now }, // Last time the issue was detected
  resolved: { type: Boolean, default: false }, // AI suggests when a bug is fixed
}, { timestamps: true });

const AIBugDetection = mongoose.model("AIBugDetection", AIBugDetectionSchema);
module.exports = AIBugDetection;
