// src/components/AddHealthcareModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";

const AddHealthcareModal = ({ show, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    password: "",
    platform: "BBSCARE", // renamed from BBSCART
    healthcareId: "",
    specialization: "",
    zone: "",
    stateCode: "",
    cityCode: "",
    qualification: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/healthcare", formData);
      if (res.status === 201) {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error("Error creating healthcare record:", err);
      alert("Failed to add healthcare provider");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050,
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div
        className="modal-dialog modal-lg"
        style={{
          maxWidth: "900px",
          width: "90%",
        }}
      >
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-semibold p-2">
              Add New Healthcare Provider
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* Name + Email */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Contact + WhatsApp */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Contact</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">PAN</label>
                  <input
                    type="text"
                    name="pan"
                    placeholder="PAN"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label ">GSTIN</label>
                  <input
                    type="text"
                    name="gst numbe"
                    placeholder="gst number"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="col-md-6 position-relative">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Set Password"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn  translate-middle-y me-2
                     text-secondary"
                    style={{
                      background: "transparent",
                      position: "absolute",
                      top: "70%",
                      right: "0px",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <IoEyeOffSharp size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>
                </div>

                {/* Platform */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Platform</label>
                  <select
                    name="platform"
                    className="form-select"
                    onChange={handleChange}
                    defaultValue="BBSCARE"
                  >
                    <option value="BBSCARE">BBSCARE</option>
                    <option value="MediDex">MediDex</option>
                    <option value="ThiaHealth">ThiaHealth</option>
                  </select>
                </div>

                {/* Provider ID + Specialization */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Provider ID</label>
                  <input
                    type="text"
                    name="healthcareId"
                    placeholder="Unique Provider ID"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="e.g. General Medicine, Pediatrics"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">District</label>
                  <input
                    type="text"
                    name="district"
                    placeholder="district"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Admin ID</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="Years of Experience"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                {/* State + City + Zone */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">State</label>
                  <input
                    type="text"
                    name="stateCode"
                    placeholder="State Code (e.g. TN)"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    name="cityCode"
                    placeholder="City Code (e.g. CHN)"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Pincode</label>
                  <input
                    type="pincode"
                    name="zone"
                    placeholder="pincode"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 px-4 pb-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHealthcareModal;
