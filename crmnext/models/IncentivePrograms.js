const mongoose = require("mongoose");

const IncentiveProgramsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  reward: { type: String, required: true },
});

module.exports = mongoose.model("IncentivePrograms", IncentiveProgramsSchema);
