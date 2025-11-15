// src/components/AgentTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";

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

  return (
    <div className="position-relative">
      <div
        className="table-responsive"
        ref={tableContainerRef}
        style={{
          maxHeight: "500px",
          overflowY: "auto",
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
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.businessPartnerCode}</td>
                  <td>{agent.pan}</td>
                  <td>{agent.gstin}</td>
                  <td>{agent.phone}</td>
                  <td>{agent.platform}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        agent.accountStatus === "active"
                          ? "success"
                          : "secondary"
                      }`}
                    >
                      {agent.accountStatus}
                    </span>
                  </td>
                  <td>{agent.district}</td>
                  <td>{agent.state}</td>
                  <td>{agent.city}</td>
                  <td>{agent.pincode}</td>
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
                      <button className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 py-1">
                        <FaRegEye className="text-dark" /> View
                      </button>
                      <button className="btn btn-outline-success d-flex align-items-center gap-1 px-2 py-1">
                        <LuArrowUp10 className="text-success" /> Promote
                      </button>
                      <button className="btn btn-outline-danger d-flex align-items-center gap-1 px-2 py-1">
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
    </div>
  );
};

export default AgentTable;
