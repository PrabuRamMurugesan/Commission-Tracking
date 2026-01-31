// models/EmerJobsCommissionRule.js
const mongoose = require("mongoose");

const emerJobsCommissionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["recruiter", "referrer"],
    required: true,
  },
  commissionStage: {
    type: String,
    enum: ["application", "shortlist", "interview", "hired"],
    required: true,
  },
  commissionType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  commissionValue: {
    type: Number,
    required: true,
  },
  jobCategory: { type: String }, // Optional: limit to job types
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.EmerJobsCommissionRule ||
  mongoose.model("EmerJobsCommissionRule", emerJobsCommissionSchema);
