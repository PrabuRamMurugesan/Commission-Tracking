// src/components/CbvTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";

const CbvTable = ({ cbv, loading, refreshList, setToast }) => {
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
    <>
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
          <table className="table table-striped table-hover align-middle">
            <thead
              className="table-dark "
              style={{ position: "sticky", top: 0, zIndex: 1 }}
            >
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <td>BPC</td>
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
                    Loading cbv...
                  </td>
                </tr>
              ) : cbv.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center">
                    No cbv found
                  </td>
                </tr>
              ) : (
                cbv.map((cbv, index) => (
                  <tr key={cbv._id}>
                    <td>{index + 1}</td>
                    <td>{cbv._id}</td>
                    <td>{cbv.name}</td>
                    <td>{cbv.email}</td>
                    <td>{cbv.businessPartnerCode}</td>
                    <td>{cbv.pan}</td>
                    <td>{cbv.gstin}</td>
                    <td>{cbv.phone}</td>
                    <td>{cbv.platform}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          cbv.accountStatus === "active"
                            ? "success"
                            : "secondary"
                        }`}
                      >
                        {cbv.accountStatus}
                      </span>
                    </td>
                    <td>{cbv.district}</td>
                    <td>{cbv.state}</td>
                    <td>{cbv.city}</td>
                    <td>{cbv.pincode}</td>
                    <td>{cbv.totalCustomers || 0}</td>
                    <td>{cbv.totalTransactions || 0}</td>
                    <td>₹{cbv.commissionEarned || 0}</td>
                    <td>₹{cbv.commissionPending || 0}</td>
                    <td>
                      {new Date(
                        cbv.joinedDate || cbv.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      <div
                        className="btn-group btn-group-sm d-flex justify-content-center  gap-2 text-center"
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
      </div>
    </>
  );
};

export default CbvTable;
