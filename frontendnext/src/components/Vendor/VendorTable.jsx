// src/components/VendorTable.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";
import ViewVendorModal from "./ViewVendorModal";

// Create credentials for a Vendor (same pattern as Territory)
async function createCredentialsForVendor(row) {
  try {
    const body = {
      email: row.email,
      name: row.name || row.contactName || "",
      role: "vendor",
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

const VendorTable = ({ vendor, loading, refreshList, setToast }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
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
  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setShowViewModal(true);
  };

  // Handle Promote action
  const handlePromote = async (vendor) => {
    try {
      if (!vendor._id) {
        return setToast?.({
          show: true,
          type: "error",
          message: "Vendor ID is missing",
        });
      }

      const response = await axios.put(`/api/vendor/${vendor._id}`, {
        accountStatus: "active",
      });

      if (response.status === 200) {
        setToast?.({
          show: true,
          type: "success",
          message: `Vendor "${vendor.name || vendor._id}" promoted successfully`,
        });
        refreshList?.();
      }
    } catch (error) {
      console.error("[handlePromote]", error);
      setToast?.({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to promote vendor",
      });
    }
  };

  // Handle Deactivate action
  const handleDeactivate = async (vendor) => {
    try {
      if (!vendor._id) {
        return setToast?.({
          show: true,
          type: "error",
          message: "Vendor ID is missing",
        });
      }

      const confirmed = window.confirm(
        `Are you sure you want to deactivate "${vendor.name || vendor._id}"?`
      );

      if (!confirmed) return;

      const response = await axios.delete(`/api/vendor/${vendor._id}`);

      if (response.status === 200 || response.status === 204) {
        console.log("Deactivate response:", response.data);
        
        setToast?.({
          show: true,
          type: "success",
          message: `Vendor "${vendor.name || vendor._id}" deactivated successfully. Status updated to inactive.`,
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
        message: error.response?.data?.message || "Failed to deactivate vendor",
      });
    }
  };

  return (
    <div className="table-responsive position-relative">
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
                  Loading vendor...
                </td>
              </tr>
            ) : vendor.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center">
                  No vendor found
                </td>
              </tr>
            ) : (
              vendor.map((vendorRow, index) => (
                <tr key={vendorRow._id}>
                  <td>{index + 1}</td>
                  <th>{vendorRow._id}</th>
                  <td>{vendorRow.name || "-"}</td>
                  <td>{vendorRow.email || "-"}</td>
                  <td>{vendorRow.businessPartnerCode || "-"}</td>
                  <td>{vendorRow.pan || "-"}</td>
                  <td>{vendorRow.gstin || "-"}</td>
                  <td>{vendorRow.phone || "-"}</td>
                  <td>{vendorRow.platform || "-"}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        vendorRow.accountStatus === "active"
                          ? "success"
                          : vendorRow.accountStatus === "suspended"
                          ? "warning"
                          : "secondary"
                      }`}
                    >
                      {vendorRow.accountStatus || "inactive"}
                    </span>
                  </td>
                  <td>{vendorRow.district || "-"}</td>
                  <td>{vendorRow.state || "-"}</td>
                  <td>{vendorRow.city || "-"}</td>
                  <td>{vendorRow.pincode || "-"}</td>
                  <td>{vendorRow.totalCustomers || 0}</td>
                  <td>{vendorRow.totalTransactions || 0}</td>
                  <td>₹{vendorRow.commissionEarned || 0}</td>
                  <td>₹{vendorRow.commissionPending || 0}</td>
                  <td>
                    {new Date(
                      vendorRow.joinedDate || vendorRow.createdAt
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
                        onClick={() => handleView(vendorRow)}
                      >
                        <FaRegEye className="text-dark" /> View
                      </button>
                      <button
                        className="btn btn-outline-success d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => handlePromote(vendorRow)}
                        disabled={!vendorRow.actions?.canPromote || vendorRow.accountStatus === "active"}
                      >
                        <LuArrowUp10 className="text-success" /> Promote
                      </button>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => handleDeactivate(vendorRow)}
                        disabled={!vendorRow.actions?.canDeactivate || vendorRow.accountStatus === "inactive"}
                      >
                        <VscActivateBreakpoints className="text-danger" />{" "}
                        Deactivate
                      </button>
                      <button
                        className="btn btn-outline-primary d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => createCredentialsForVendor(vendorRow)}
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

      {/* View Vendor Modal */}
      <ViewVendorModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedVendor(null);
        }}
        vendor={selectedVendor}
      />
    </div>
  );
};

export default VendorTable;
