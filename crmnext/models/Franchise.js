import mongoose from 'mongoose';

const franchiseeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  address: String,
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Franchisee || mongoose.model('Franchisee', franchiseeSchema);


// const mongoose = require('mongoose');

// const franchiseSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   region: { type: String, required: true },
//   vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
//   earnings: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = mongoose.model('Franchise', franchiseSchema);
