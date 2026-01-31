import mongoose from "mongoose";

const CommissionRateSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // "BBSCART", "Golldex", "Thiaworld"
    productCategory: { type: String, required: true }, // e.g., "Gold", "Grocery"
    rate: { type: Number, required: true }, // percentage
  },
  { _id: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    phone: { type: String, required: true },

    whatsappNumber: { type: String, default: "" },

    password: { type: String, required: true },

    profilePic: { type: String, default: "" },

    designation: { type: String, default: "Customer" },

    zone: { type: String, default: "" },

    // franchiseeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    agentId: { type: mongoose.Types.ObjectId, ref: "Agent", required: false },
    vendorId: { type: mongoose.Types.ObjectId, ref: "Vendor", required: false },
    franchiseId: {
      type: mongoose.Types.ObjectId,
      ref: "Franchise",
      required: false,
    },
    territoryId: {
      type: mongoose.Types.ObjectId,
      ref: "TerritoryHead",
      required: false,
    },

    cbvId: {
      type: mongoose.Types.ObjectId,
      ref: "Cbv",
      required: false,
    },
    joinedAt: Date,
    platform: {
      type: String,
      enum: ["BBSCART", "Golldex", "Thiaworld"],
      required: true,
    },

    commissionRates: [CommissionRateSchema],

    totalCustomers: {
      type: Number,
      default: 0,
    },

    totalTransactions: {
      type: Number,
      default: 0,
    },

    commissionEarned: {
      type: Number,
      default: 0,
    },

    commissionPending: {
      type: Number,
      default: 0,
    },

    joinedDate: {
      type: Date,
      default: Date.now,
    },

    actions: {
      canPromote: { type: Boolean, default: true },
      canDeactivate: { type: Boolean, default: true },
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    loginHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        userCustomer: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
