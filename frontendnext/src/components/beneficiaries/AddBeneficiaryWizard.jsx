import React, { useState } from "react";
import Step1CoreDetails from "./steps/Step1CoreDetails";
import Step2Identification from "./steps/Step2Identification";
import Step3Address from "./steps/Step3Address";
import Step4FamilyRelations from "./steps/Step4FamilyRelations";
import Step5MedicalInfo from "./steps/Step5MedicalInfo";
import Step6Insurance from "./steps/Step6Insurance";
import Step7Preferences from "./steps/Step7Preferences";
import Step8Review from "./steps/Step8Review";

import axios from "axios";

const AddBeneficiaryWizard = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);

  // Global form state
  const [form, setForm] = useState({
    // Step 1
    fullName: "",
    phone: "",
    email: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    occupation: "",

    // Step 2
    aadhaar: "",
    aadhaarDocumentUrl: null,
    otherIdType: "",
    otherIdNumber: "",
    kycStatus: "pending",

    // Step 3
    address: "",
    city: "",
    state: "",
    pincode: "",
    geoLocationLat: "",
    geoLocationLong: "",

    // Step 4
    relationship: "",
    emergencyContactName: "",
    emergencyContactPhone: "",

    // Step 5
    bloodGroup: "",
    existingConditions: [],
    allergies: [],
    currentMedications: [],
    disabilityStatus: "",
    lastHealthCheckupDate: "",

    // Step 6
    membershipId: "",
    membershipStartDate: "",
    membershipEndDate: "",
    planType: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    coverageType: "",
    totalUtilizedAmount: "",
    remainingLimit: "",
    visitsCount: "",
    hospitalPreference: "",

    // Step 7
    otpPhoneVerification: false,
    emailVerified: false,
    preferredLanguage: "",
    communicationPreference: "",
    referrerId: "",
    profilePhoto: null,

    // System
    createdBy: localStorage.getItem("user"),
  });

  const goNext = () => setStep(step + 1);
  const goBack = () => setStep(step - 1);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleFile = (name, file) => {
    setForm({ ...form, [name]: file });
  };

const handleSubmit = async () => {
  try {
    const fd = new FormData();

    // 🔹 Get current logged-in user and extract id
    const user = JSON.parse(localStorage.getItem("user")); // key = "user"
    const createdById = user?.id || ""; // just the id

    // 🔹 Append all form fields EXCEPT createdBy
    Object.entries(form).forEach(([key, value]) => {
      if (key === "createdBy") {
        // skip the createdBy from form state
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => fd.append(key, v));
      } else {
        fd.append(key, value);
      }
    });

    // 🔹 Append createdBy exactly once, as plain id
    if (createdById) {
      fd.append("createdBy", createdById);
    }

    const res = await axios.post("/api/beneficiaries", fd);

    if (res.data.success) {
      alert("Beneficiary Created Successfully!");
      onSuccess();
      onClose();
    }
  } catch (err) {
    console.error(err);
    alert("Error creating beneficiary");
  }
};

  return (
    <div className="modal-overlay">
      <div className="wizard-container">
        <div className="wizard-header">
          <h2>Add Beneficiary</h2>
          <p>Step {step} of 8</p>
        </div>

        <div className="wizard-body">
          {step === 1 && (
            <Step1CoreDetails form={form} onChange={handleChange} />
          )}
          {step === 2 && (
            <Step2Identification
              form={form}
              onChange={handleChange}
              onFile={handleFile}
            />
          )}
          {step === 3 && <Step3Address form={form} onChange={handleChange} />}
          {step === 4 && (
            <Step4FamilyRelations form={form} onChange={handleChange} />
          )}
          {step === 5 && (
            <Step5MedicalInfo form={form} onChange={handleChange} />
          )}
          {step === 6 && <Step6Insurance form={form} onChange={handleChange} />}
          {step === 7 && (
            <Step7Preferences
              form={form}
              onChange={handleChange}
              onFile={handleFile}
            />
          )}
          {step === 8 && <Step8Review form={form} />}
        </div>

        <div className="wizard-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={goBack}>
              Back
            </button>
          )}

          {step < 8 && (
            <button className="btn btn-primary" onClick={goNext}>
              Next
            </button>
          )}

          {step === 8 && (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          )}

          <button className="btn btn-outline-danger" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBeneficiaryWizard;
