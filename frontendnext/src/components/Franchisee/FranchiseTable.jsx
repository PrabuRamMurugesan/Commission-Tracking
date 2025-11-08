// src/components/FranciseTable.jsx  (FULL REPLACEMENT)
import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaRegEye } from "react-icons/fa";
import { LuArrowUp10 } from "react-icons/lu";
import { VscActivateBreakpoints } from "react-icons/vsc";

/** Map raw BBSlive docs to flat fields the table can render */
function normalizeFranchise(doc = {}) {
  // helper getters
  const g = (o, path, fallback = "—") => {
    try {
      return (
        path
          .split(".")
          .reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ??
        fallback
      );
    } catch {
      return fallback;
    }
  };

  const name =
    [doc.vendor_fname, doc.vendor_lname].filter(Boolean).join(" ").trim() ||
    doc.gst_legal_name ||
    doc.name ||
    "—";

  const email = doc.email || "—";
  const bpc = doc.businessPartnerCode || doc.bpc || "—";
  const pan = doc.pan || doc.pan_number || "—";
  const gstin = doc.gstin || doc.gst_number || "—";

  const phone = doc.phone || doc.outlet_contact_no || doc.alt_mobile || "—";

  const district = doc.district || g(doc, "gst_address.district") || "—";
  const state =
    doc.state ||
    g(doc, "register_business_address.state") ||
    g(doc, "gst_address.state") ||
    g(doc, "outlet_location.state") ||
    "—";
  const city =
    doc.city ||
    g(doc, "register_business_address.city") ||
    g(doc, "outlet_location.city") ||
    "—";
  const pincode =
    doc.pincode ||
    g(doc, "register_business_address.postalCode") ||
    g(doc, "gst_address.postalCode") ||
    g(doc, "outlet_location.postalCode") ||
    "—";

  const platform = doc.platform || doc.role || "BBSCART";
  const accountStatus =
    doc.accountStatus ||
    (doc.is_active
      ? "active"
      : doc.application_status
      ? String(doc.application_status)
      : "pending");

  const joinedDate =
    doc.joinedDate || doc.submitted_at || doc.created_at || doc.updated_at;

  return {
    _id: String(doc._id || "—"),
    name,
    email,
    bpc,
    pan,
    gstin,
    phone,
    platform,
    accountStatus,
    district,
    state,
    city,
    pincode,
    totalCustomers: doc.totalCustomers || 0,
    totalTransactions: doc.totalTransactions || 0,
    commissionEarned: doc.commissionEarned || 0,
    commissionPending: doc.commissionPending || 0,
    joinedDate,
    createdAt: doc.created_at || doc.createdAt,
  };
}

const FranciseTable = ({ francise = [], loading, refreshList, setToast }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const el = tableContainerRef.current;
    const onScroll = () => setShowScrollTop((el?.scrollTop || 0) > 200);
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    tableContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  // DEBUG: show first row shape in console so we know what API returns
  useEffect(() => {
    if (francise?.length) {
      // eslint-disable-next-line no-console
      console.log("[Franchise RAW #0]", francise[0]);
      // eslint-disable-next-line no-console
      console.log("[Franchise NORMALIZED #0]", normalizeFranchise(francise[0]));
    }
  }, [francise]);

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
          const move = (ev) => {
            ev.preventDefault();
            el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX);
          };
          const up = () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
          };
          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", up);
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
                <td colSpan="20" className="text-center">
                  Loading Franchise…
                </td>
              </tr>
            ) : !francise?.length ? (
              <tr>
                <td colSpan="20" className="text-center">
                  No Franchise found
                </td>
              </tr>
            ) : (
              francise.map((doc, i) => {
                const row = normalizeFranchise(doc);
                return (
                  <tr key={row._id || i}>
                    <td>{i + 1}</td>
                    <td>{row._id}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.bpc}</td>
                    <td>{row.pan}</td>
                    <td>{row.gstin}</td>
                    <td>{row.phone}</td>
                    <td>{row.platform}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          row.accountStatus === "active"
                            ? "success"
                            : "secondary"
                        }`}
                      >
                        {row.accountStatus}
                      </span>
                    </td>
                    <td>{row.district}</td>
                    <td>{row.state}</td>
                    <td>{row.city}</td>
                    <td>{row.pincode}</td>
                    <td>{row.totalCustomers}</td>
                    <td>{row.totalTransactions}</td>
                    <td>₹{row.commissionEarned}</td>
                    <td>₹{row.commissionPending}</td>
                    <td>
                      {row.joinedDate
                        ? new Date(row.joinedDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div
                        className="btn-group btn-group-sm d-flex justify-content-center gap-2"
                        role="group"
                      >
                        <button className="btn btn-outline-dark d-flex align-items-center gap-1 px-2 py-1">
                          <FaRegEye /> View
                        </button>
                        <button className="btn btn-outline-success d-flex align-items-center gap-1 px-2 py-1">
                          <LuArrowUp10 /> Promote
                        </button>
                        <button className="btn btn-outline-danger d-flex align-items-center gap-1 px-2 py-1">
                          <VscActivateBreakpoints /> Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-dark rounded-circle shadow position-absolute d-flex align-items-center justify-content-center"
          style={{ bottom: 20, right: 20, width: 40, height: 40, zIndex: 10 }}
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default FranciseTable;
