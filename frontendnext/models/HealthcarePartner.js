import mongoose from "mongoose";

const HealthcarePartnerSchema = new mongoose.Schema(
  {
    partnerCode: { type: String, unique: true },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    aadhaar: { type: String },
    pan: { type: String },

    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },

    clinicName: { type: String },
    clinicType: { type: String }, // hospital/clinic/lab
    clinicAddress: { type: String },

    registrationNumber: { type: String },
    registrationDoc: { type: String },

    profilePhoto: { type: String },
    gender: { type: String },
    district: { type: String },
    platform: { type: String },
    gstin: { type: String },

    registrationDocumentUrl: { type: String },
    clinicLicenseUrl: { type: String },
    gstCertificateUrl: { type: String },
    aadhaarDocumentUrl: { type: String },

    photos: [{ type: String }],

    supportedServices: [{ type: String }],
    supportedPlanTiers: [{ type: String }],

    commissionRates: {
      opd: { type: Number, default: 0 },
      ipd: { type: Number, default: 0 },
      labs: { type: Number, default: 0 }
    },

    assignedFranchiseId: { type: String },
    assignedAgentId: { type: String },
    createdBy: { type: String }, // admin ID
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HealthcarePartner ||
  mongoose.model("HealthcarePartner", HealthcarePartnerSchema);
