// src/components/AddVendorModal.jsx
import React, { useState } from "react";
import axios from "axios";

const AddVendorModal = ({ show, onClose, onSuccess }) => {
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
  const API = import.meta.env.VITE_API_URL; // or use hardcoded if you prefer

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/vendor`, formData);
      if (res.status === 201) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating Vendor:", err);
      alert("Failed to create Vendor");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Vendor</h5>
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
                name="productCategory"
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
                placeholder="Franchisee ID"
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
                Save Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVendorModal;
