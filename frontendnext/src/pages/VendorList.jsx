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
  const [collapsed, setCollapsed] = useState(false);

  const fetchVendor = async () => {
    try {
      setLoading(true);

      // Read current user fresh inside the function
      let currentUser = null;
      try {
        const raw = localStorage.getItem("user");
        currentUser = raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error("Failed to parse current user from localStorage:", e);
      }

      if (!currentUser) {
        console.warn("No logged-in user found in localStorage.user");
      }

      const role = (currentUser?.role || "").toLowerCase();

      // Try all possible keys where franchise link could be stored
      const franchiseId =
        currentUser?.franchiseId ||
        currentUser?.franchiseeId ||
        currentUser?.franchiseLink ||
        currentUser?.franchise ||
        null;

      // Possible keys for territory
      const territoryId =
        currentUser?.territoryId ||
        currentUser?.territoryHeadId ||
        currentUser?.territory ||
        null;

      // Possible keys for agent
      const agentIdFromUser =
        currentUser?.agentId || currentUser?._id || currentUser?.id || null;

      const params = {};

      // Franchise dashboard → all vendors under this franchise
      if ((role === "franchise" || role === "franchisee") && franchiseId) {
        params.franchiseeId = franchiseId;
      }

      // Territory dashboard → all vendors under this territory
      if (
        (role === "territory" ||
          role === "territoryhead" ||
          role === "territory_head") &&
        territoryId
      ) {
        params.territoryId = territoryId;
      }

      // Agent dashboard → only this agent's vendors
      if (role === "agent" && agentIdFromUser) {
        params.agentId = agentIdFromUser;
      }

      // Debug logs so you can see what is going on
      console.log("VendorList → currentUser:", currentUser);
      console.log("VendorList → role:", role);
      console.log("VendorList → axios params:", params);

      const res = await axios.get("/api/vendor", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      const vendorsList = res.data?.vendor || res.data || [];
      setVendor(vendorsList);
      // Update filtered list with fresh data
      setFilteredVendor(vendorsList);
      setLoading(false);
    } catch (err) {
      console.error("Error loading Vendor:", err);
      setToast({
        show: true,
        message: "Failed to load Vendor",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      <div className="d-flex flex-row vw-100">
        <Sidebar />
        <div
          className={`d-flex align-items-start justify-content-center flex-grow-1 transition-all `}
          style={{
            width: collapsed ? "100vw" : "calc(100vw - 280px)",
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
