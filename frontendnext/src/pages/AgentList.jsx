// src/pages/AgentList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AgentTable from "../components/Agent/AgentTable";
import AgentFilterBar from "../components/Agent/AgentFilterBar";
import AddAgentModal from "../components/Agent/AddAgentModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
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
      const res = await axios.get("/api/agents", {
        params: {
          franchiseeId:
            currentUser?.role === "franchise" ? currentUser.id : undefined,
        },
      });
      setAgents(res.data.agents);
      console.log(res.data.agents, "res.data.agents");

      setFilteredAgents(res.data.agents);
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

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Agent List</h3>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Agent
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchAgents}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => exportAgentsToCSV(filteredAgents)}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <AgentFilterBar agents={agents} setFilteredAgents={setFilteredAgents} />

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
  );
};

export default AgentList;
