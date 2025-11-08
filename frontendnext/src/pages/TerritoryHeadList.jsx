// src/pages/TerritoryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TerritoryTable from "../components/TerritoryHead/TerritoryTable";
import TerritoryFilterBar from "../components/TerritoryHead/TerritoryFilterBar";
import AddTerritoryModal from "../components/TerritoryHead/AddTerritoryHeadModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import Sidebar from "../components/Sidebar";
import { FaSitemap } from "react-icons/fa";
const TerritoryHeadList = () => {
  const [territory, setTerritory] = useState([]);
  const [filteredTerritory, setFilteredTerritory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchTerritory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/territory", {
        params: {
          franchiseeId:
            currentUser?.role === "franchise" ? currentUser.id : undefined,
        },
      });
      setTerritory(res.data.territory);
      setFilteredTerritory(res.data.territory);
      setLoading(false);
    } catch (err) {
      console.error("Error loading Territory:", err);
      setToast({
        show: true,
        message: "Failed to load Territory",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerritory();
  }, []);

  const handleAddSuccess = () => {
    fetchTerritory();
    setToast({
      show: true,
      message: "Territory saved successfully!",
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3   className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>   <FaSitemap  className="me-2 text-dark" />Territory List</h3>
            
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setShowModal(true)}
                >
                   Add Territory
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={fetchTerritory}
                >
                   Refresh
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => exportAgentsToCSV(filteredTerritory)}
                >
                   Export CSV
                </button>
              </div>
            </div>

            <TerritoryFilterBar
              territory={territory}
              setFilteredTerritory={setFilteredTerritory}
            />

            <TerritoryTable
              territory={filteredTerritory}
              loading={loading}
              refreshList={fetchTerritory}
              setToast={setToast}
            />

            <AddTerritoryModal
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

export default TerritoryHeadList;

