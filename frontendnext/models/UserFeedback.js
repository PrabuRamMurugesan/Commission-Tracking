const mongoose = require("mongoose");

const UserFeedbackSchema = new mongoose.Schema({
  category: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserFeedback", UserFeedbackSchema);
