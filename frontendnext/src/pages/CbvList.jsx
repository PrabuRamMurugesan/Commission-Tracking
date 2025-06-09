// src/pages/CbvList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CbvTable from "../components/Cbv/CbvTable";
import CbvFilterBar from "../components/Cbv/CbvFilterBar";
import AddCbvModal from "../components/Cbv/AddCbvModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
const CbvList = () => {
  const [cbv, setCbv] = useState([]);
  const [filteredCbv, setFilteredCbv] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchCbv = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/cbv", {
        params: {
          franchiseeId:
            currentUser?.role === "franchise" ? currentUser.id : undefined,
        },
      });
      setCbv(res.data.cbv);
      setFilteredCbv(res.data.cbv);
      setLoading(false);
    } catch (err) {
      console.error("Error loading Cbv:", err);
      setToast({ show: true, message: "Failed to load Cbv", type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCbv();
  }, []);

  const handleAddSuccess = () => {
    fetchCbv();
    setToast({
      show: true,
      message: "Cbv saved successfully!",
      type: "success",
    });
    setShowModal(false);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Cbv List</h3>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Cbv
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchCbv}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => exportAgentsToCSV(filteredCbv)}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <CbvFilterBar cbv={cbv} setFilteredCbv={setFilteredCbv} />

      <CbvTable
        cbv={filteredCbv}
        loading={loading}
        refreshList={fetchCbv}
        setToast={setToast}
      />

      <AddCbvModal
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

export default CbvList;
