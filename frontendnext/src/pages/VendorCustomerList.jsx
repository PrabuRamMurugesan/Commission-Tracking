import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { MdSupportAgent } from "react-icons/md";
import VendorFilterBar from "../components/Vendor/VendorFilterBar";
const VendorCustomerList = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

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

  // Scroll to top function
  const scrollToTop = () => {
    tableContainerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        console.log("🧾 Vendor API Response:", res.data.vendors); // ✅ ADD THIS

        setVendors(res.data.vendors || []);
         setFilteredVendors(res.data.vendors || []); 
      } catch (err) {
        console.error("Error loading vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
          <div
            className="d-flex flex-column gap-3 border rounded-3 shadow-sm bg-white p-5 w-100 "
            style={{
              maxWidth: "1400px",
              minHeight: "90vh",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <h2
              className="fw-semibold text-dark mb-3 mx-2 d-flex align-items-center"
              style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
            >
              <MdSupportAgent className="me-2 text-dark" /> Choose Vendor for
              Customers List
            </h2>
<VendorFilterBar
  vendors={vendors}
  setFilteredVendors={setFilteredVendors}
  key={vendors.length}
/>

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
                    {filteredVendors.map((vendor, index) => (
                      <tr key={vendor._id}>
                        <td>{index + 1}</td>
                        <td>{vendor._id}</td>
                        <td>{vendor.name}</td>
                        <td>{vendor.email}</td>
                        <td>{vendor.phone || "-"}</td>
                        <td>{vendor.pan}</td>
                        <td>{vendor.gstin}</td>
                        <td>{vendor.district}</td>
                        <td>{vendor.state}</td>
                        <td>{vendor.city}</td>
                        <td>{vendor.pincode}</td>
                        <td>{vendor.totalCustomers || 0}</td>
                        <td>{vendor.totalTransactions || 0}</td>
                        <td>
                          ₹ {vendor.commissionEarned?.toLocaleString() || 0}
                        </td>
                        <td>
                          ₹ {vendor.commissionPending?.toLocaleString() || 0}
                        </td>
                        <td>
                          <div
                            className="btn-group btn-group-sm d-flex justify-content-center  gap-2 text-center text-nowrap"
                            role="group"
                            aria-label="Actions"
                          >
                            <button
                              className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 py-1"
                              onClick={() =>
                                navigate(
                                  `/dashboard/customer-list?role=vendor&userId=${vendor._id}`
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
        </div>{" "}
      </div>
    </>
  );
};

export default VendorCustomerList;
