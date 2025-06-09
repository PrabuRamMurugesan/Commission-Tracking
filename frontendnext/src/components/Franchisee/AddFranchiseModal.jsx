// src/components/AddAgentModal.jsx
import React, { useState } from "react";
import axios from "axios";

const AddFranchiseModal = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    password: "",
    platform: "BBSCART",
    franchiseeId: "",
    commissionRates: [
      { platform: "BBSCART", productCategory: "Gold", rate: 5 },
    ],
    zone: "",
    stateCode: "", // ✅ Add this
    cityCode: "", // ✅ Add this
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/franchise", formData);
      if (res.status === 201) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating agent:", err);
      alert("Failed to franchise agent");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Franchise</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                name="whatsappNumber"
                placeholder="WhatsApp Number"
                className="form-control mb-2"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <select
                name="platform"
                className="form-select mb-2"
                onChange={handleChange}
                defaultValue="BBSCART"
              >
                <option value="BBSCART">BBSCART</option>
                <option value="Golldex">Golldex</option>
                <option value="Thiaworld">Thiaworld</option>
              </select>
              <input
                type="text"
                name="franchiseeId"
                placeholder="Admin ID"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                name="stateCode"
                placeholder="State Code (e.g. TN)"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                name="cityCode"
                placeholder="City Code (e.g. CHN)"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
              <input
                type="text"
                name="zone"
                placeholder="Zone"
                className="form-control mb-2"
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Agent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFranchiseModal;
