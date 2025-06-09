// src/pages/FranchiseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import FranciseTable from "../components/Franchisee/FranchiseTable";
import FranciseFilterBar from "../components/Franchisee/FranchiseFilterBar";
import AddFranciseModal from "../components/Franchisee/AddFranchiseModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
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
      console.log(res.data.francise, "res.data.francise");
      
      setFilteredFrancise(res.data.francise);
      setLoading(false);
    } catch (err) {
      console.error("Error loading Francise:", err);
      setToast({ show: true, message: "Failed to load Francise", type: "error" });
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

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Franchise List</h3>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Franchise
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchFrancise}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => exportAgentsToCSV(filteredFrancise)}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <FranciseFilterBar francise={francise} setFilteredFrancise={setFilteredFrancise} />

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
  );
};

export default FranchiseList;
