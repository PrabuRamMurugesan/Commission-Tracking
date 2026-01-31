// src/components/AgentTable.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";
import ViewAgentModal from "./ViewAgentModal";

// Create credentials for an Agent (same pattern as Territory)
async function createCredentialsForAgent(row) {
  try {
    const body = {
      email: row.email,
      name: row.name || row.contactName || "",
      role: "agent",
      partnerId: row._id || row.id,
      platform: "crm",
      autoReset: true,
    };

    const r = await fetch("/api/partners/create-credentials", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admintoken") || ""}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (!r.ok || !data?.success) {
      throw new Error(data?.message || "Failed to create credentials");
    }

    alert(
      `Credentials created for ${body.email}. Reset link sent if email is configured.`
    );
  } catch (e) {
    console.error(e);
    alert(e.message || "Error");
  }
}

const AgentTable = ({ agents, loading, refreshList, setToast }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const tableContainerRef = useRef(null);

  // Handle scroll detection
  const handleScroll = () => {
    if (tableContainerRef.current.scrollTop > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  // Attach scroll listener
  useEffect(() => {
    const tableDiv = tableContainerRef.current;
    if (tableDiv) {
      tableDiv.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableDiv) {
        tableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    tableContainerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle View action
  const handleView = (agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  // Handle Promote action
  const handlePromote = async (agent) => {
    try {
      if (!agent._id) {
        return setToast?.({
          show: true,
          type: "error",
          message: "Agent ID is missing",
        });
      }

      const response = await axios.put(`/api/agents/${agent._id}`, {
        accountStatus: "active",
      });

      if (response.status === 200) {
        setToast?.({
          show: true,
          type: "success",
          message: `Agent "${agent.name || agent._id}" promoted successfully`,
        });
        refreshList?.();
      }
    } catch (error) {
      console.error("[handlePromote]", error);
      setToast?.({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to promote agent",
      });
    }
  };

  // Handle Deactivate action
  const handleDeactivate = async (agent) => {
    try {
      if (!agent._id) {
        return setToast?.({
          show: true,
          type: "error",
          message: "Agent ID is missing",
        });
      }

      const confirmed = window.confirm(
        `Are you sure you want to deactivate "${agent.name || agent._id}"?`
      );

      if (!confirmed) return;

      const response = await axios.delete(`/api/agents/${agent._id}`);

      if (response.status === 200 || response.status === 204) {
        console.log("Deactivate response:", response.data);
        
        setToast?.({
          show: true,
          type: "success",
          message: `Agent "${agent.name || agent._id}" deactivated successfully. Status updated to inactive.`,
        });
        
        if (refreshList) {
          setTimeout(async () => {
            try {
              await refreshList();
              console.log("List refreshed after deactivation");
            } catch (refreshError) {
              console.error("Error refreshing list:", refreshError);
            }
          }, 300);
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("[handleDeactivate]", error);
      setToast?.({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to deactivate agent",
      });
    }
  };

  return (
    <div className="position-relative">
      <div
        className="table-responsive"
        ref={tableContainerRef}
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          overflowX: "auto", // enable x-scroll
          WebkitOverflowScrolling: "touch", // smooth scroll for touch devices
          cursor: "grab", // optional: shows grab cursor
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget;
          let startX = e.pageX - el.offsetLeft;
          let scrollLeft = el.scrollLeft;

          const handleMouseMove = (ev) => {
            ev.preventDefault();
            const x = ev.pageX - el.offsetLeft;
            const walk = (x - startX) * 1; // scroll speed multiplier
            el.scrollLeft = scrollLeft - walk;
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
      >
        <table className="table table-striped table-hover">
          <thead
            className="table-dark"
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>BPC</th>
              <td>PAN</td>
              <td>GSTIN</td>
              <th>Phone</th>
              <th>Platform</th>
              <th>Status</th>
              <th>District</th>
              <th>State</th>
              <th>City</th>
              <th>Pincode</th>
              <th>Customers</th>
              <th>Transactions</th>
              <th>Earned</th>
              <th>Pending</th>
              <th>Joined</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center">
                  Loading agents...
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center">
                  No agents found
                </td>
              </tr>
            ) : (
              agents.map((agent, index) => (
                <tr key={agent._id}>
                  <td>{index + 1}</td>
                  <th>{agent._id}</th>
                  <td>{agent.name || "-"}</td>
                  <td>{agent.email || "-"}</td>
                  <td>{agent.businessPartnerCode || "-"}</td>
                  <td>{agent.pan || "-"}</td>
                  <td>{agent.gstin || "-"}</td>
                  <td>{agent.phone || "-"}</td>
                  <td>{agent.platform || "-"}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        agent.accountStatus === "active"
                          ? "success"
                          : agent.accountStatus === "suspended"
                          ? "warning"
                          : "secondary"
                      }`}
                    >
                      {agent.accountStatus || "inactive"}
                    </span>
                  </td>
                  <td>{agent.district || "-"}</td>
                  <td>{agent.state || "-"}</td>
                  <td>{agent.city || "-"}</td>
                  <td>{agent.pincode || "-"}</td>
                  <td>{agent.totalCustomers || 0}</td>
                  <td>{agent.totalTransactions || 0}</td>
                  <td>₹{agent.commissionEarned || 0}</td>
                  <td>₹{agent.commissionPending || 0}</td>
                  <td>
                    {new Date(
                      agent.joinedDate || agent.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    <div
                      className="btn-group btn-group-sm d-flex justify-content-center gap-2 text-center"
                      role="group"
                      aria-label="Actions"
                    >
                      <button
                        className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => handleView(agent)}
                      >
                        <FaRegEye className="text-dark" /> View
                      </button>
                      <button
                        className="btn btn-outline-success d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => handlePromote(agent)}
                        disabled={!agent.actions?.canPromote || agent.accountStatus === "active"}
                      >
                        <LuArrowUp10 className="text-success" /> Promote
                      </button>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => handleDeactivate(agent)}
                        disabled={!agent.actions?.canDeactivate || agent.accountStatus === "inactive"}
                      >
                        <VscActivateBreakpoints className="text-danger" />{" "}
                        Deactivate
                      </button>
                      <button
                        className="btn btn-outline-primary d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => createCredentialsForAgent(agent)}
                      >
                        Create credentials
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-dark rounded-circle shadow position-absolute d-flex align-items-center justify-content-center "
          style={{
            bottom: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            zIndex: 10,
          }}
        >
          <FaArrowUp />
        </button>
      )}

      {/* View Agent Modal */}
      <ViewAgentModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAgent(null);
        }}
        agent={selectedAgent}
      />
    </div>
  );
};

export default AgentTable;
