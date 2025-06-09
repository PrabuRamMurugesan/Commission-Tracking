// src/pages/TerritoryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TerritoryTable from "../components/TerritoryHead/TerritoryTable";
import TerritoryFilterBar from "../components/TerritoryHead/TerritoryFilterBar";
import AddTerritoryModal from "../components/TerritoryHead/AddTerritoryHeadModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
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
      setToast({ show: true, message: "Failed to load Territory", type: "error" });
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

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Territory List</h3>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Territory
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchTerritory}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => exportAgentsToCSV(filteredTerritory)}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <TerritoryFilterBar territory={territory} setFilteredTerritory={setFilteredTerritory} />

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
  );
};

export default TerritoryHeadList;
