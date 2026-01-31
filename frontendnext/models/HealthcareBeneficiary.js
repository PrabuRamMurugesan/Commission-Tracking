import mongoose from "mongoose";

const HealthcareBeneficiarySchema = new mongoose.Schema(
  {
    // -------------------------
    // Core Details
    // -------------------------
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    age: { type: Number },
    dateOfBirth: { type: Date },
    gender: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },

    // -------------------------
    // Identification
    // -------------------------
    aadhaar: { type: String },
    aadhaarDocumentUrl: { type: String }, // filename only
    otherIdType: { type: String },
    otherIdNumber: { type: String },
    kycStatus: { type: String, default: "pending" },

    // -------------------------
    // Address
    // -------------------------
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    geoLocationLat: { type: Number },
    geoLocationLong: { type: Number },

    // -------------------------
    // Family & Relations
    // -------------------------
    relationship: { type: String },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },

    // -------------------------
    // Medical Info
    // -------------------------
    bloodGroup: { type: String },
    existingConditions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    disabilityStatus: { type: String },
    lastHealthCheckupDate: { type: Date },

    // -------------------------
    // Insurance / Program
    // -------------------------
    membershipId: { type: String },
    membershipStartDate: { type: Date },
    membershipEndDate: { type: Date },
    planType: { type: String },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    coverageType: { type: String },
    totalUtilizedAmount: { type: Number, default: 0 },
    remainingLimit: { type: Number, default: 0 },
    visitsCount: { type: Number, default: 0 },
    hospitalPreference: { type: String },

    // -------------------------
    // System Fields
    // -------------------------
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthcarePartner",
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    deletedAt: { type: Date, default: null },
    status: { type: String, default: "active" },
    notes: { type: String },
    tags: { type: [String], default: [] },
    profilePhoto: { type: String },

    // -------------------------
    // Verification & Preferences
    // -------------------------
    otpPhoneVerification: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    preferredLanguage: { type: String },
    communicationPreference: { type: String },
    referrerId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HealthcareBeneficiary ||
  mongoose.model("HealthcareBeneficiary", HealthcareBeneficiarySchema);
