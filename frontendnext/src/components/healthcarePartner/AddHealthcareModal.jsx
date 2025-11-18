// src/components/Healthcare/AddHealthcareModal.jsx

import React, { useState } from "react";
import axios from "axios";

const AddHealthcareModal = ({ show, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

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

            {/* ------------------------------ */}
            {/* SECTION 4 – DOCUMENT UPLOADS   */}
            {/* ------------------------------ */}
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
