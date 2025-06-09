// models/AchievementCommission.js
const mongoose = require("mongoose");

const achievementCommissionSchema = new mongoose.Schema({
  role: { type: String, required: true },
  targetType: {
    type: String,
    enum: ["sales", "revenue"],
    required: true,
  },
  targetValue: { type: Number, required: true },
  bonusType: {
    type: String,
    enum: ['cash', 'coupon'], // Only allows lowercase
    required: true,
  }  ,
  bonusValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports =
  mongoose.models.AchievementCommission ||
  mongoose.model("AchievementCommission", achievementCommissionSchema);
