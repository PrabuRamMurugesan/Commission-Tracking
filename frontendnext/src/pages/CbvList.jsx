// src/pages/CbvList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CbvTable from "../components/Cbv/CbvTable";
import CbvFilterBar from "../components/Cbv/CbvFilterBar";
import AddCbvModal from "../components/Cbv/AddCbvModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import Sidebar from "../components/Sidebar";
import { TfiUser } from "react-icons/tfi";
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
      const cbvsList = res.data.cbv || [];
      setCbv(cbvsList);
      // Update filtered list with fresh data
      setFilteredCbv(cbvsList);
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
              <h3
                className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                <TfiUser className="me-2 text-dark" />
                Customer Between Vendor List
              </h3>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-dark "
                  onClick={() => setShowModal(true)}
                >
                  Add CBV
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={fetchCbv}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => exportAgentsToCSV(filteredCbv)}
                >
                  Export CSV
                </button>
              </div>
            </div>

            <CbvFilterBar cbv={cbv} setFilteredCbv={setFilteredCbv} key={cbv.length} />

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
        </div>
      </div>
    </>
  );
};

export default CbvList;
