// src/pages/HealthcarePartners.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import ToastMessage from "../../components/ToastMessage";

import HealthcareFilterBar from "../../components/healthcarePartner/HealthcareFilterBar";
import HealthcareTable from "../../components/healthcarePartner/HealthcareTable";
import AddHealthcareModal from "../../components/healthcarePartner/AddHealthcareModal";

import { FaUserNurse } from "react-icons/fa";

const HealthcarePartners = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const fetchPartners = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/healthcare");
      const list = res.data?.data || [];

      setPartners(list);
      setFilteredPartners(list);
      setLoading(false);
    } catch (err) {
      console.error("Healthcare load error:", err);
      setToast({
        show: true,
        message: "Failed to load healthcare partners",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAdded = () => {
    fetchPartners();
    setToast({
      show: true,
      message: "Healthcare Partner added successfully!",
      type: "success",
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="d-flex flex-row vw-100">
        <Sidebar />

        <div
          className={`d-flex align-items-start justify-content-center flex-grow-1 transition-all`}
          style={{
            width: collapsed ? "100vw" : "calc(100vw - 280px)",
            margin: "4rem 0",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div
            className="d-flex flex-column gap-3 border rounded-3 shadow-sm bg-white p-5 w-100"
            style={{
              maxWidth: "1400px",
              minHeight: "90vh",
            }}
          >
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <h3
                className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                <FaUserNurse className="me-2 text-dark" />
                Healthcare Partners
              </h3>

              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setShowModal(true)}
                >
                  Add Healthcare Partner
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={fetchPartners}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* FILTER BAR */}
            <HealthcareFilterBar
              partners={partners}
              setFilteredPartners={setFilteredPartners}
            />

            {/* TABLE */}
            <HealthcareTable
              partners={filteredPartners}
              loading={loading}
              refreshList={fetchPartners}
              setToast={setToast}
            />

            {/* MODAL */}
            <AddHealthcareModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={handleAdded}
            />

            {toast.show && (
              <ToastMessage
                message={toast.message}
                type={toast.type}
                onClose={() =>
                  setToast({
                    show: false,
                    message: "",
                    type: "",
                  })
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthcarePartners;
