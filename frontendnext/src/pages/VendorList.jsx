// src/pages/VendorList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorTable from "../components/Vendor/VendorTable";
import VendorFilterBar from "../components/Vendor/VendorFilterBar";
import AddVendorModal from "../components/Vendor/AddVendorModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
const VendorList = () => {
  const [vendor, setVendor] = useState([]);
  const [filteredVendor, setFilteredVendor] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/vendor", {
        params: {
          franchiseeId:
            currentUser?.role === "franchise" ? currentUser.id : undefined,
        },
      });
      setVendor(res.data.vendor);
      setFilteredVendor(res.data.vendor);
      setLoading(false);
    } catch (err) {
      console.error("Error loading Vendor:", err);
      setToast({ show: true, message: "Failed to load Vendor", type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  const handleAddSuccess = () => {
    fetchVendor();
    setToast({
      show: true,
      message: "Vendor saved successfully!",
      type: "success",
    });
    setShowModal(false);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Vendor List</h3>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Vendor
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchVendor}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => exportAgentsToCSV(filteredVendor)}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <VendorFilterBar vendor={vendor} setFilteredVendor={setFilteredVendor} />

      <VendorTable
        vendor={filteredVendor}
        loading={loading}
        refreshList={fetchVendor}
        setToast={setToast}
      />

      <AddVendorModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddSuccess}
      />

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default VendorList;
