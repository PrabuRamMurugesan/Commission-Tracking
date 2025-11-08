// src/pages/VendorList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorTable from "../components/Vendor/VendorTable";
import VendorFilterBar from "../components/Vendor/VendorFilterBar";
import AddVendorModal from "../components/Vendor/AddVendorModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import Sidebar from "../components/Sidebar";
import { FaVenusDouble } from "react-icons/fa";
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
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <div className="d-flex flex-row vw-100">
        <Sidebar />
        <div
          className={`d-flex align-items-start justify-content-center flex-grow-1 transition-all `}
          style={{
            width: collapsed ? "100vw" : "calc(100vw - 280px)", // adjust this width to match sidebar width
            margin: "4rem 0",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div
            className="d-flex flex-column gap-3 border rounded-3 shadow-sm bg-white p-5 w-100 "
            style={{
              maxWidth: "1400px",
              minHeight: "90vh",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <h3
                className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                {" "}
                <FaVenusDouble className="me-2 text-dark" />
                Vendor List
              </h3>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-dark "
                  onClick={() => setShowModal(true)}
                >
                  Add Vendor
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={fetchVendor}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => exportAgentsToCSV(filteredVendor)}
                >
                  Export CSV
                </button>
              </div>
            </div>

            <VendorFilterBar
              vendor={vendor}
              setFilteredVendor={setFilteredVendor}
            />

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
        </div>
      </div>
    </>
  );
};

export default VendorList;
