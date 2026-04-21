import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const HealthcareCustomerList = () => {
  const [healthcareUsers, setHealthcareUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef(null);

  const scrollToTop = () => {
    tableContainerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  useEffect(() => {
    const fetchHealthcare = async () => {
      try {
        const res = await axios.get("/api/users/by-role?role=healthcare");
        // Accessing .cbv based on your console screenshot
        console.log("🧾 Healthcare API Response:", res.data);
        setHealthcareUsers(res.data.cbv || []);
      } catch (err) {
        console.error("Error loading healthcare users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthcare();
  }, []);

  const [collapsed] = useState(false);

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
          <div className="container p-4">
            <h3
              className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
              style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
            >
              Choose Healthcare for Customers List
            </h3>

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
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                }}
              >
                <table className="table table-bordered table-hover table-sm mb-0">
                  <thead className="table-dark">
                    <tr className="text-nowrap">
                      <th>#</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>PAN</th>
                      <th>GSTIN</th>
                      <th>District</th>
                      <th>State</th>
                      <th>City</th>
                      <th>Pincode</th>
                      <th>Total Customers</th>
                      <th>Total Transactions</th>
                      <th>Commission Earned</th>
                      <th>Commission Pending</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthcareUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{user.pan || "-"}</td>
                        <td>{user.gstin || "-"}</td>
                        <td>{user.district || "-"}</td>
                        <td>{user.state || "-"}</td>
                        <td>{user.city || "-"}</td>
                        <td>{user.pincode || "-"}</td>
                        <td>{user.totalCustomers || 0}</td>
                        <td>{user.totalTransactions || 0}</td>
                        <td>₹ {user.commissionEarned?.toLocaleString() || 0}</td>
                        <td>₹ {user.commissionPending?.toLocaleString() || 0}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-2 py-1"
                              onClick={() =>
                                navigate(`/dashboard/customer-list?role=healthcare&userId=${user._id}`)
                              }
                            >
                              <FaRegEye className="text-dark" />
                              View Customers
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="btn btn-dark rounded-circle shadow position-fixed d-flex align-items-center justify-content-center"
                style={{
                  bottom: "40px",
                  right: "40px",
                  width: "40px",
                  height: "40px",
                  zIndex: 10,
                }}
              >
                <FaArrowUp />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthcareCustomerList;