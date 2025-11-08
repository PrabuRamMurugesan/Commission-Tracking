// src/pages/DeliveryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import Sidebar from "../Sidebar";
import DeliveryTable from "./DeliveryTable";
import DeliveryFilterBar from "./DeliveryFilterBar";
import AddDeliveryModal from "./AddDeliveryModal";

const DeliveryList = () => {
  const [delivery, setDelivery] = useState([]);
  const [filteredDelivery, setFilteredDelivery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch delivery list
  const fetchDelivery = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/franchise", {
        params: {
          franchiseId:
            currentUser?.role === "franchise" ? currentUser.id : undefined,
        },
      });

      const data = res.data?.delivery || [];
      setDelivery(data);
      setFilteredDelivery(data);
    } catch (err) {
      console.error("Error loading delivery:", err);
      setToast({
        show: true,
        message: "Failed to load delivery",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  // ✅ After successful add
  const handleAddSuccess = () => {
    fetchDelivery();
    setToast({
      show: true,
      message: "Delivery saved successfully!",
      type: "success",
    });
    setShowModal(false);
  };

  // ✅ CSV Export
  const exportAgentsToCSV = (data) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] || "")).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DeliveryPartners.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex flex-row vw-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="d-flex align-items-start justify-content-center flex-grow-1 transition-all"
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
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* ===== Header Section ===== */}
          <div className="d-flex justify-content-between align-items-center mb-3 px-2 flex-wrap">
            <h3
              className="fw-semibold text-dark d-flex align-items-center"
              style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
            >
              <MdDeliveryDining size={35} className="me-2 text-dark" />
              Delivery Partner
            </h3>

            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-dark"
                onClick={() => setShowModal(true)}
              >
                Add Delivery
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={fetchDelivery}
              >
                Refresh
              </button>
              <button
                className="btn btn-outline-success"
                onClick={() => exportAgentsToCSV(filteredDelivery)}
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* ===== Filter Bar ===== */}
          <DeliveryFilterBar
            delivery={delivery}
            setFilteredDelivery={setFilteredDelivery}
          />

          {/* ===== Delivery Table ===== */}
          <DeliveryTable delivery={filteredDelivery} loading={loading} />

          {/* ===== Add Delivery Modal ===== */}
          <AddDeliveryModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={handleAddSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryList;
