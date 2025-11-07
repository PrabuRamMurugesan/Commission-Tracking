// src/components/DeliveryTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";

const DeliveryTable = ({ francise = [], loading, refreshList, setToast }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef(null);

  // Scroll detection
  const handleScroll = () => {
    if (
      tableContainerRef.current &&
      tableContainerRef.current.scrollTop > 200
    ) {
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

  // Scroll to top
  const scrollToTop = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
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
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          cursor: "grab",
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget;
          let startX = e.pageX - el.offsetLeft;
          let scrollLeft = el.scrollLeft;

          const handleMouseMove = (ev) => {
            ev.preventDefault();
            const x = ev.pageX - el.offsetLeft;
            const walk = (x - startX) * 1;
            el.scrollLeft = scrollLeft - walk;
            document.addEventListener("mousemove", handleMouseUp);
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
      >
        <table className="table table-striped table-hover align-middle">
          <thead
            className="table-dark"
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <tr className="text-nowrap">
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>BPC</th>
              <th>PAN</th>
              <th>GSTIN</th>
              <th>Phone</th>
        
              <th>District</th>
              <th>State</th>
              <th>City</th>
              <th>Pincode</th>
              <th>Status</th>
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
                <td colSpan="17" className="text-center">
                  Loading Franchise...
                </td>
              </tr>
            ) : !Array.isArray(francise) || francise.length === 0 ? (
              <tr>
                <td colSpan="17" className="text-center">
                  No Delivery found
                </td>
              </tr>
            ) : (
              francise.map((agent, index) => (
                <tr key={agent._id || index}>
                  <td>{index + 1}</td>
                  <td>{agent._id || "—"}</td>
                  <td>{agent.name || "—"}</td>
                  <td>{agent.email || "—"}</td>
                  <td>{agent.bpc || "—"}</td>
                  <td>{agent.pan || "—"}</td>
                  <td>{agent.gstin || "—"}</td>
                  <td>{agent.phone || "—"}</td>
                  <td>{agent.platform || "—"}</td>
                  <td>{agent.district || "—"}</td>
                  <td>{agent.state || "—"}</td>
                  <td>{agent.city || "—"}</td>
                  <td>{agent.pincode || "—"}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        agent.accountStatus === "active"
                          ? "success"
                          : "secondary"
                      }`}
                    >
                      {agent.accountStatus || "inactive"}
                    </span>
                  </td>
                  <td>{agent.totalCustomers || 0}</td>
                  <td>{agent.totalTransactions || 0}</td>
                  <td>₹{agent.commissionEarned || 0}</td>
                  <td>₹{agent.commissionPending || 0}</td>
                  <td>
                    {agent.joinedDate || agent.createdAt
                      ? new Date(
                          agent.joinedDate || agent.createdAt
                        ).toLocaleDateString()
                      : "—"}
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-dark rounded-circle shadow position-absolute d-flex align-items-center justify-content-center"
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

export default DeliveryTable;
