// src/components/AddCbvModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
const AddCbvModal = ({ show, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await axios.post(`${API}/api/cbv`, formData);
      if (res.status === 201) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating Cbv:", err);
      alert("Failed to create Cbv");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show fade d-block justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050,
      }}
      role="dialog"
    >
      <div
        className="modal-dialog modal-lg"
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-semibold">
              Add New Customer Between Vendor
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* Name */}
                <div className="col-md-6">
                  <label htmlFor="name">Name : </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control mb-2"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="email">E-mail : </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control mb-2"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone">Contact : </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="form-control mb-2"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="whatsapp"></label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    className="form-control mb-2"
                    onChange={handleChange}
                  />{" "}
                </div>
                {/* PAN */}
                <div className="col-md-6">
                  <label className="form-label">PAN</label>
                  <input
                    type="text"
                    name="pan"
                    placeholder="PAN Number"
                    className="form-control"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* GST */}
                <div className="col-md-6">
                  <label className="form-label">GSTIN</label>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="GST Number"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 position-relative">
                  <label className="form-label" htmlFor="password">
                    Password :
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="form-control "
                    required
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn  translate-middle-y me-2 border-0 bg-transparent text-secondary"
                    style={{ position: "absolute", top: "70%", right: "0px" }}
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

                <div className="col-md-6">
                  <label className="form-label">Platform : </label>
                  <select
                    name="productCategory"
                    className="form-select"
                    onChange={handleChange}
                    defaultValue="BBSCART"
                  >
                    <option value="BBSCART">BBSCART</option>
                    <option value="Golldex">Golldex</option>
                    <option value="Thiaworld">Thiaworld</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="franchiseeId">Admin ID : </label>
                  <input
                    type="text"
                    name="franchiseeId"
                    placeholder="Franchisee ID"
                    className="form-control mb-2"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="">State :</label>
                  <input
                    type="text"
                    name="stateCode"
                    placeholder="State Code (e.g. TN)"
                    className="form-control mb-2"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="">City :</label>
                  <input
                    type="text"
                    name="cityCode"
                    placeholder="City Code (e.g. CHN)"
                    className="form-control mb-2"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="zone">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode (e.g. 600001)"
                    className="form-control mb-2"
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                Save Cbv
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>
        {`
        .form-group{
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:between;
        gap:10px;
        }
        .form-group label{
        width:100px;
        }
        `}
      </style>
    </div>
  );
};

export default AddCbvModal;
