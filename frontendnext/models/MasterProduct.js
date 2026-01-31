// models/MasterProduct.js
const mongoose = require("mongoose");

const masterProductSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    brand: { type: String },
    metalType: { type: String },
    metalPurity: { type: String },
    grossWeight: { type: Number },
    netWeight: { type: Number },
    stoneWeight: { type: Number },
    stoneType: { type: String },
    imageUrl: { type: String },
    tags: [String],
    price: { type: Number },
    makingCharges: { type: Number },
    makingChargesDiscount: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt
  }
);


module.exports =
  mongoose.models.MasterProduct ||
  mongoose.model("MasterProduct", masterProductSchema);
