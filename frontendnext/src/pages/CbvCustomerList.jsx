import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const CbvCustomerList = () => {
  const [cbvs, setCbvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
  useEffect(() => {
    const fetchCbvs = async () => {
      try {
        const res = await axios.get("/api/cbv");
        console.log("🧾 Cbv API Response:", res.data.cbv); // ✅ ADD THIS

        setCbvs(res.data.cbv || []);
      } catch (err) {
        console.error("Error loading cbvs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCbvs();
  }, []);
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
          <div className="container p-4">
            <h3
              className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
              style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
            >
              Choose Cbv for Customers List
            </h3>

            <div className="position-relative">
              <div
                className="table-responsive"
                ref={tableContainerRef}
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  maxHeight: "500px",
                  overflowY: "auto",
                  overflowX: "auto", // ✅ enable x-scroll
                  WebkitOverflowScrolling: "touch", // ✅ smooth scroll for touch devices
                  cursor: "grab", // 👆 optional: shows grab cursor
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
                <table className="table table-bordered table-hover table-sm mb-0">
                  <thead className="table-dark">
                    <tr className="text-nowrap">
                      <th>#</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <td>PAN</td>
                      <td>GSTIN</td>

                      <th>District</th>
                      <th>State</th>
                      <th>City</th>
                      <th>Pincode</th>
                      <th>Total Customers</th>
                      <th>Total Transactions</th>
                      <th>Commission Earned</th>
                      <th>Commission Pending</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cbvs.map((cbv, index) => (
                      <tr key={cbv._id}>
                        <td>{index + 1}</td>
                        <td>{cbv._id}</td>
                        <td>{cbv.name}</td>
                        <td>{cbv.email}</td>
                        <td>{cbv.phone || "-"}</td>
                        <td>{cbv.pan}</td>
                        <td>{cbv.gstin}</td>
                        <td>{cbv.district}</td>
                        <td>{cbv.state}</td>
                        <td>{cbv.city}</td>
                        <td>{cbv.pincode}</td>
                        <td>{cbv.totalCustomers || 0}</td>
                        <td>{cbv.totalTransactions || 0}</td>
                        <td>₹ {cbv.commissionEarned?.toLocaleString() || 0}</td>
                        <td>
                          ₹ {cbv.commissionPending?.toLocaleString() || 0}
                        </td>
                        <td>
                          <div
                            className="btn-group btn-group-sm text-nowrap d-flex justify-content-center  gap-2 text-center"
                            role="group"
                            aria-label="Actions"
                          >
                            <button
                              className="btn btn-outline-danger d-flex align-items-center gap-1 px-2 py-1"
                              onClick={() =>
                                navigate(
                                  `/dashboard/customer-list?role=cbv&userId=${cbv._id}`
                                )
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
            {/* Scroll to Top Button */}
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
        </div>
      </div>
    </>
  );
};

export default CbvCustomerList;
