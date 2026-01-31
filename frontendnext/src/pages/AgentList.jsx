// src/pages/AgentList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AgentTable from "../components/Agent/AgentTable";
import AgentFilterBar from "../components/Agent/AgentFilterBar";
import AddAgentModal from "../components/Agent/AddAgentModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import { FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchAgents = async () => {
    try {
      setLoading(true);

      // Read user from localStorage
      const rawUser = localStorage.getItem("user");
      let territoryId = null;

      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          territoryId = parsed?.territoryId || null;
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      }

      // Build API URL & params
      let url = "/api/agents";
      let params = {};

      // If user is a franchise → filter using franchiseeId
      if (currentUser?.role === "franchise") {
        params.franchiseeId = currentUser.franchiseeId;
      }

      // If user has a territoryId → override URL with territory filter
      if (territoryId) {
        url = `/api/agents?territoryId=${territoryId}`;
      }

      // API call
      const res = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      const agentsList = res.data.agents || res.data || [];
      setAgents(agentsList);
      // Update filtered list with fresh data
      setFilteredAgents(agentsList);
      setLoading(false);
    } catch (err) {
      console.error("Error loading agents:", err);
      setToast({ show: true, message: "Failed to load agents", type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddSuccess = () => {
    fetchAgents();
    setToast({
      show: true,
      message: "Agent saved successfully!",
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
            <div className="d-flex justify-content-between align-items-center mb-3 px-2 flex-wrap">
              <h3
                className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                <FiUsers className="me-2 text-dark" />
                Agent List
              </h3>

              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setShowModal(true)}
                >
                  Add Agent
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={fetchAgents}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => exportAgentsToCSV(filteredAgents)}
                >
                  Export CSV
                </button>
              </div>
            </div>

            <AgentFilterBar
              agents={agents}
              setFilteredAgents={setFilteredAgents}
              key={agents.length}
            />

            <AgentTable
              agents={filteredAgents}
              loading={loading}
              refreshList={fetchAgents}
              setToast={setToast}
            />

            <AddAgentModal
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

export default AgentList;
