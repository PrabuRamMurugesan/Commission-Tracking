const mongoose = require("mongoose");

const CommissionSlabSchema = new mongoose.Schema({
  slabType: {
    type: String,
    enum: ["OrderValue", "QuantityBased", "Custom"],
    required: true,
  },
  commissionType: {
    type: String,
    enum: ["flat", "percentage"],
    required: true,
  },
  commissionPercentage: {
    type: Number,
    required: function () {
      return this.commissionType === "percentage";
    },
  },
  commissionValue: {
    type: Number,
    required: function () {
      return this.commissionType === "flat";
    },
  },
  platform: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },

  minValue: Number,
  maxValue: Number,
});
  

module.exports =
  mongoose.models.CommissionSlab ||
  mongoose.model("CommissionSlab", CommissionSlabSchema);
