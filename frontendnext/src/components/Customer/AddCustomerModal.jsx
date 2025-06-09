// src/components/Customer/AddCustomerModal.jsx
import React, { useState } from "react";
import axios from "axios";
import ToastMessage from "../ToastMessage";

export default function AddCustomerModal({ show, onClose, onSuccess }) {
  const [form, setForm] = useState({
    /* ... */
  });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/customer`,
        { ...form, referralId: form.referralId || undefined },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 201) {
        setToast({ show: true, type: "success", message: "Customer added!" });
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        type: "error",
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Customer</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <input
                name="name"
                placeholder="Name"
                required
                className="form-control mb-2"
                onChange={handleChange}
                value={form.name}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="form-control mb-2"
                onChange={handleChange}
                value={form.email}
              />
              <input
                name="phone"
                placeholder="Phone"
                required
                className="form-control mb-2"
                onChange={handleChange}
                value={form.phone}
              />
              <input
                name="whatsappNumber"
                placeholder="WhatsApp"
                className="form-control mb-2"
                onChange={handleChange}
                value={form.whatsappNumber}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="form-control mb-2"
                onChange={handleChange}
                value={form.password}
              />

              <select
                name="platform"
                className="form-select mb-2"
                value={form.platform}
                onChange={handleChange}
                required
              >
                <option value="BBSCART">BBSCART</option>
              </select>

              <input
                name="referralId"
                placeholder="Referral ID (optional)"
                className="form-control mb-2"
                onChange={handleChange}
                value={form.referralId}
              />

              <input
                name="zone"
                placeholder="Zone"
                className="form-control mb-2"
                onChange={handleChange}
                value={form.zone}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}
