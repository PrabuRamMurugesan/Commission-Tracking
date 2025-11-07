import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { RiCloseLine } from "react-icons/ri";
const FranchiseCustomerList = () => {
  const [franchise, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef(null);
  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        console.log("🧾 Franchise API Response:", res.data.franchise); // ✅ ADD THIS

        setFranchises(res.data.franchise || []);
      } catch (err) {
        console.error("Error loading franchise:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchises();
  }, []);
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
            <div className="container ">
              <div className="d-flex justify-content-between align-items-center border my-1  p-1 bg-dark rounded-2">
                <h2 className=" h4 text-white font-bold px-3">
                  Choose Franchise for Customers List
                </h2>
                <a href="/Dashboard">
                  {" "}
                  <RiCloseLine size={35} className="text-white p-1" />
                </a>
              </div>
              <div
                className="table-responsive"
                ref={tableContainerRef}
                style={{
                  maxHeight: "500px",
                  maxHeight: "600px",
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
                  <thead
                    className="table-dark"
                    style={{ position: "sticky", top: 0, zIndex: 1 }}
                  >
                    <tr className="text-nowrap">
                      <th>#</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <td>PAN</td>
                      <td>GSTIN</td>
                      <th>Status</th>
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
                    {franchise.map((franchise, index) => (
                      <tr key={franchise._id}>
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{franchise._id}</td>
                        <td className="p-3">{franchise.name}</td>
                        <td className="p-3">{franchise.email}</td>
                        <td className="p-3">{franchise.pan}</td>
                        <td className="p-3">{franchise.gstin}</td>
                        <td className="p-3">{franchise.phone || "-"}</td>
                        <td className="p-3">{franchise.status}</td>
                        <td className="p-3">{franchise.district}</td>
                        <td className="p-3">{franchise.state}</td>
                        <td className="p-3">{franchise.city}</td>
                        <td className="p-3">{franchise.pincode}</td>
                        <td className="p-3">{franchise.totalCustomers || 0}</td>
                        <td className="p-3">
                          {franchise.totalTransactions || 0}
                        </td>
                        <td>
                          ₹ {franchise.commissionEarned?.toLocaleString() || 0}
                        </td>
                        <td>
                          ₹ {franchise.commissionPending?.toLocaleString() || 0}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-dark btn-sm d-flex align-items-center flex-row gap-1 px-2 py-1 flex-nowrap"
                            onClick={() =>
                              navigate(
                                `/dashboard/customer-list?role=franchise&userId=${franchise._id}`
                              )
                            }
                          >
                            View Customers
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="btn btn-dark rounded-circle shadow position-absolute d-flex align-items-center justify-content-center "
            style={{
              bottom: "90px",
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
    </>
  );
};

export default FranchiseCustomerList;
