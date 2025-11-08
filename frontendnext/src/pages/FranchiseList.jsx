// src/pages/FranchiseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import FranciseTable from "../components/Franchisee/FranchiseTable";
import FranciseFilterBar from "../components/Franchisee/FranchiseFilterBar";
import AddFranciseModal from "../components/Franchisee/AddFranchiseModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import { FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
const FranchiseList = () => {
  const [francise, setFrancise] = useState([]);
  const [filteredFrancise, setFilteredFrancise] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchFrancise = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/franchise", {
        params: {
          franchiseId:
            currentUser?.role === "franchise" ? currentUser.id : undefined,
        },
      });
      setFrancise(res.data.francise);
      console.log(res.data, "res.data");

      console.log(res.data.francise, "res.data.francise");

      setFilteredFrancise(res.data.francise);
      setLoading(false);
    } catch (err) {
      console.error("Error loading Francise:", err);
      setToast({
        show: true,
        message: "Failed to load Francise",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrancise();
  }, []);

  const handleAddSuccess = () => {
    fetchFrancise();
    setToast({
      show: true,
      message: "Francise saved successfully!",
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
            <div className="d-flex justify-content-between align-items-center mb-3 px-2 flex-wrap">
              <h3
                className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                <FiUsers className="me-2 text-dark" />
                Franchise List
              </h3>

              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-dark  "
                  onClick={() => setShowModal(true)}
                >
                  Add Franchise
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={fetchFrancise}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => exportAgentsToCSV(filteredFrancise)}
                >
                  Export CSV
                </button>
              </div>
            </div>

            <FranciseFilterBar
              francise={francise}
              setFilteredFrancise={setFilteredFrancise}
            />

            <FranciseTable
              francise={filteredFrancise}
              loading={loading}
              refreshList={fetchFrancise}
              setToast={setToast}
            />

            <AddFranciseModal
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

export default FranchiseList;
