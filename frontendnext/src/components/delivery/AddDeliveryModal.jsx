import React, { useState } from "react";
import axios from "axios";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
const AddDeliveryModal = ({ show, onClose, onSuccess }) => {
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
    <div
      className="modal show fade d-block d-flex justify-content-center align-items-center  "
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // semi-transparent backdrop
        zIndex: 1050,
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div
        className="modal-dialog "
        style={{
          minWidth: "600px",
          minHeight: "500px",
          maxWidth: "100%",        
        }}
      >
        <div className="modal-content "
        >
          <div className="modal-header">
            <h5 className="modal-title">Add New Delivery Partner</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex flex-column gap-2 border rounded-3 p-5 "  style={{margin:"30px"}}>
              <div className="form-group">
                <label htmlFor="name">Name : </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail : </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control "
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Contact : </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="form-control "
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="whatsapp"></label>
                <input
                  type="text"
                  name="whatsappNumber"
                  placeholder="WhatsApp Number"
                  className="form-control mb-2"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group position-relative">
                <label className="form-label" htmlFor="password">
                  Password :
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="form-control mb-2"
                  required
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary  translate-middle-y me-2 py-1 px-2 border-0 bg-transparent"
                  style={{
                    transform: "translateY(-50%)",
                    position: "absolute",
                    top: "17px",
                    right: "1px",
                    color: "#6c757d",
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
              <div className="form-group">
                <label htmlFor="platform">Platform : </label>
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
              </div>
             <div className="form-group">
              <label htmlFor="franchiseeId">Admin ID : </label>
               <input
                type="text"
                name="franchiseeId"
                placeholder="Admin ID"
                className="form-control mb-2"
                required
                onChange={handleChange}
              />
             </div>
              <div className="form-group">
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
            <div className="form-group">
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
              <div className="form-group">
                <label htmlFor="zone">Zone :</label>
                <input
                type="text"
                name="zone"
                placeholder="Zone"
                className="form-control mb-2"
                onChange={handleChange}
              />
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
                Save 
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

export default AddDeliveryModal;
