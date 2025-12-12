// src/components/Healthcare/AddHealthcareModal.jsx

import React, { useState } from "react";
import axios from "axios";

const AddHealthcareModal = ({ show, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
const supportedServicesOptions = [
  "OPD",
  "IPD",
  "Emergency",
  "ICU",
  "NICU",
  "PICU",
  "Radiology",
  "Laboratory",
  "Pathology",
  "MRI",
  "CT Scan",
  "X-Ray",
  "Ultrasound",
  "Pharmacy",
  "Teleconsultation",
  "Physiotherapy",
  "Dialysis",
  "Blood Bank",
  "Ambulance",
  "Day Care",
  "General Surgery",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Oncology",
  "Gastroenterology",
  "Dermatology",
  "ENT",
  "Pulmonology",
  "Psychiatry",
  "Ophthalmology",
  "Urology",
  "Nephrology",
  "General Medicine",
  "Dental",
  "Rehab & Wellness",
];
const handleCheckboxArray = (fieldName, value) => {
  setForm((prev) => {
    const set = new Set(prev[fieldName]);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    return {
      ...prev,
      [fieldName]: Array.from(set),
    };
  });
};
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhaar: "",
    pan: "",

    clinicName: "",
    clinicType: "",
    registrationNumber: "",
    platform: "",
    gstin: "",
    clinicAddress: "",

    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "India",

    profilePhoto: null,
    registrationDoc: null,
    clinicCertificate: null,
    idProof: null,
        supportedServices: "",
    supportedPlanTiers: "",

    opd: "",
    ipd: "",
    labs: "",

    assignedFranchiseId: "",
    assignedAgentId: "",

    clinicLicenseUrl: null,
    gstCertificateUrl: null,
    aadhaarDocumentUrl: null,
    photos: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await axios.post("/api/healthcare/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onSuccess();
      } else {
        alert(res.data.error || "Failed to save");
      }
    } catch (err) {
      console.error("Healthcare Save Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">Add Healthcare Partner</h5>
            <button
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            {/* ---------------------------- */}
            {/* SECTION 1 – PERSONAL DETAILS */}
            {/* ---------------------------- */}

            <h5 className="fw-bold mb-3">Personal Details</h5>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  name="fullName"
                  type="text"
                  className="form-control"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  name="phone"
                  type="text"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Aadhaar</label>
                <input
                  name="aadhaar"
                  type="text"
                  className="form-control"
                  value={form.aadhaar}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">PAN</label>
                <input
                  name="pan"
                  type="text"
                  className="form-control"
                  value={form.pan}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ---------------------------------------- */}
            {/* SECTION 2 – CLINIC / HOSPITAL DETAILS    */}
            {/* ---------------------------------------- */}
            <h5 className="fw-bold mb-3">Clinic / Hospital Details</h5>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Clinic Name *</label>
                <input
                  name="clinicName"
                  type="text"
                  className="form-control"
                  value={form.clinicName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Clinic Type *</label>
                <select
                  name="clinicType"
                  className="form-control"
                  value={form.clinicType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option>Hospital</option>
                  <option>Clinic</option>
                  <option>Lab</option>
                  <option>Diagnostics</option>
                  <option>Specialist Center</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Registration Number</label>
                <input
                  name="registrationNumber"
                  type="text"
                  className="form-control"
                  value={form.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Platform *</label>
                <select
                  name="platform"
                  className="form-control"
                  value={form.platform}
                  onChange={handleChange}
                >
                  <option value="">Select Platform</option>
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Both</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">GSTIN</label>
                <input
                  name="gstin"
                  type="text"
                  className="form-control"
                  value={form.gstin}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Clinic Address</label>
                <textarea
                  name="clinicAddress"
                  className="form-control"
                  value={form.clinicAddress}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {/* ---------------------------- */}
            {/* SECTION 3 – ADDRESS INFO     */}
            {/* ---------------------------- */}
            <h5 className="fw-bold mb-3">Address Details</h5>

            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <label className="form-label">Address *</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="col-md-4">
                <label className="form-label">City *</label>
                <input
                  name="city"
                  type="text"
                  className="form-control"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">District *</label>
                <input
                  name="district"
                  type="text"
                  className="form-control"
                  value={form.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">State *</label>
                <input
                  name="state"
                  type="text"
                  className="form-control"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Pincode *</label>
                <input
                  name="pincode"
                  type="text"
                  className="form-control"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Country</label>
                <input
                  name="country"
                  type="text"
                  className="form-control"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* ---------------------------------------- */}
            {/* SECTION 5 – SUPPORTED SERVICES */}
            {/* ---------------------------------------- */}
            <h5 className="fw-bold mb-3 mt-4">Supported Services</h5>
            <div className="card-body">
              <label className="form-label fw-semibold">
                Supported Services
              </label>
              <div className="row g-2 mb-3">
                {supportedServicesOptions.map((svc) => (
                  <div className="col-md-4 col-lg-3" key={svc}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`svc-${svc}`}
                        checked={form.supportedServices.includes(svc)}
                        onChange={() =>
                          handleCheckboxArray("supportedServices", svc)
                        }
                      />
                      <label
                        className="form-check-label small"
                        htmlFor={`svc-${svc}`}
                      >
                        {svc}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* <label className="form-label fw-semibold">
                    Supported Plan Tiers
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {planTierOptions.map((tier) => (
                      <div className="form-check" key={tier}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`tier-${tier}`}
                          checked={form.supportedPlanTiers.includes(tier)}
                          onChange={() =>
                            handleCheckboxArray("supportedPlanTiers", tier)
                          }
                        />
                        <label
                          className="form-check-label small"
                          htmlFor={`tier-${tier}`}
                        >
                          {tier}
                        </label>
                      </div>
                    ))}
                  </div> */}
            </div>

            {/* ---------------------------------------- */}
            {/* SECTION 6 – SUPPORTED PLAN TIERS */}
            {/* ---------------------------------------- */}
            <h5 className="fw-bold mb-3 mt-4">Supported Plan Tiers</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <label className="form-label">
                  Supported Plan Tiers (comma separated)
                </label>
                <input
                  name="supportedPlanTiers"
                  className="form-control"
                  value={form.supportedPlanTiers}
                  onChange={handleChange}
                  placeholder="Example: Base,Prime,Elite"
                />
              </div>
            </div>

            {/* ---------------------------------------- */}
            {/* SECTION 7 – COMMISSION RATES */}
            {/* ---------------------------------------- */}
            <h5 className="fw-bold mb-3 mt-4">Commission Rates</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">OPD (%)</label>
                <input
                  name="opd"
                  className="form-control"
                  type="number"
                  value={form.opd}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">IPD (%)</label>
                <input
                  name="ipd"
                  className="form-control"
                  type="number"
                  value={form.ipd}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Labs (%)</label>
                <input
                  name="labs"
                  className="form-control"
                  type="number"
                  value={form.labs}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ---------------------------------------- */}
            {/* SECTION 8 – ASSIGNMENT */}
            {/* ---------------------------------------- */}
            <h5 className="fw-bold mb-3 mt-4">Assignment</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Assigned Franchise ID</label>
                <input
                  name="assignedFranchiseId"
                  className="form-control"
                  value={form.assignedFranchiseId}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Assigned Agent ID</label>
                <input
                  name="assignedAgentId"
                  className="form-control"
                  value={form.assignedAgentId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="fw-bold mb-3">Document Uploads</h5>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Profile Photo</label>
                <input
                  name="profilePhoto"
                  type="file"
                  className="form-control"
                  onChange={handleFile}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Registration Document *</label>
                <input
                  name="registrationDoc"
                  type="file"
                  className="form-control"
                  onChange={handleFile}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Clinic Certificate</label>
                <input
                  name="clinicCertificate"
                  type="file"
                  className="form-control"
                  onChange={handleFile}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">ID Proof</label>
                <input
                  name="idProof"
                  type="file"
                  className="form-control"
                  onChange={handleFile}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-dark"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Partner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHealthcareModal;
