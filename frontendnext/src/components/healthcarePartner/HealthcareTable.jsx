// src/pages/HealthcareList.jsx
import React, { useState, useRef, useEffect } from "react";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { FaArrowUp, FaRegEye } from "react-icons/fa";

// ✅ Mock Data (displayed directly)
const mockHealthcare = [
  {
    _id: "H001",
    name: "MediCare Hospital",
    email: "contact@medicare.com",
    bpc: "BPC12345",
    pan: "ABCDE1234F",
    gstin: "22ABCDE1234F1Z5",
    phone: "9876543210",
    platform: "Online",
    district: "Bengaluru Urban",
    state: "Karnataka",
    city: "Bengaluru",
    pincode: "560001",
    accountStatus: "active",
    totalCustomers: 150,
    totalTransactions: 380,
    commissionEarned: 24500,
    commissionPending: 3200,
    joinedDate: "2024-05-12",
  },
  {
    _id: "H002",
    name: "Apollo Health Center",
    email: "info@apollohealth.in",
    bpc: "BPC67890",
    pan: "PQRSX6789Z",
    gstin: "29PQRSX6789Z1Z8",
    phone: "9988776655",
    platform: "Offline",
    district: "Chennai",
    state: "Tamil Nadu",
    city: "Chennai",
    pincode: "600001",
    accountStatus: "inactive",
    totalCustomers: 90,
    totalTransactions: 200,
    commissionEarned: 14200,
    commissionPending: 4100,
    joinedDate: "2023-09-20",
  },
];

const HealthcareList = () => {
  const [healthcare, setHealthcare] = useState(mockHealthcare);
  const [filteredHealthcare, setFilteredHealthcare] = useState(mockHealthcare);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef(null);

  // Scroll detection
  const handleScroll = () => {
    if (tableContainerRef.current?.scrollTop > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  // Attach scroll listener
  useEffect(() => {
    const tableDiv = tableContainerRef.current;
    if (tableDiv) tableDiv.addEventListener("scroll", handleScroll);
    return () => tableDiv?.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    tableContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid mt-5">
      <h4 className="fw-bold mb-4">Healthcare List</h4>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="position-relative">
          <div
            className="table-responsive border rounded shadow-sm"
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
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            <table className="table table-striped align-middle">
              <thead className="table-dark"
               style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr className="text-nowrap">
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>BPC</th>
                  <th>PAN</th>
                  <th>GSTIN</th>
                  <th>Phone</th>
                  <th>Platform</th>
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
                {filteredHealthcare.length > 0 ? (
                  filteredHealthcare.map((item, index) => (
                    <tr className="text-nowrap" key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>{item._id || "—"}</td>
                      <td>{item.name || "—"}</td>
                      <td>{item.email || "—"}</td>
                      <td>{item.bpc || "—"}</td>
                      <td>{item.pan || "—"}</td>
                      <td>{item.gstin || "—"}</td>
                      <td>{item.phone || "—"}</td>
                      <td>{item.platform || "—"}</td>
                      <td>{item.district || "—"}</td>
                      <td>{item.state || "—"}</td>
                      <td>{item.city || "—"}</td>
                      <td>{item.pincode || "—"}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            item.accountStatus === "active"
                              ? "success"
                              : "secondary"
                          }`}
                        >
                          {item.accountStatus || "inactive"}
                        </span>
                      </td>
                      <td>{item.totalCustomers || 0}</td>
                      <td>{item.totalTransactions || 0}</td>
                      <td>₹{item.commissionEarned || 0}</td>
                      <td>₹{item.commissionPending || 0}</td>
                      <td>
                        {item.joinedDate || item.createdAt
                          ? new Date(
                              item.joinedDate || item.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1">
                            <FaRegEye /> View
                          </button>
                          <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1">
                            <LuArrowUp10 /> Promote
                          </button>
                          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                            <VscActivateBreakpoints /> Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="20" className="text-center py-4 text-muted">
                      No healthcare records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="btn btn-dark position-absolute end-0 bottom-0 m-3 rounded-circle shadow"
            >
              <FaArrowUp />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthcareList;
