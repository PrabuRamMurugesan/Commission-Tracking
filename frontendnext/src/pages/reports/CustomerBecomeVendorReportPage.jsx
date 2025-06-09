// pages/CustomerBecomeVendorReportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const CustomerBecomeVendorReportPage = () => {
  const [cbavs, setCbavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchCBAVs();
  }, []);

  const fetchCBAVs = async () => {
    try {
      const response = await axios.get("/api/reports/cbavs", {
        params: { startDate, endDate, search },
      });
      setCbavs(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching CBAVs:", error);
      setCbavs([]);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(cbavs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CBAVs");
    XLSX.writeFile(workbook, "CBAV_Report.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2>Customer Become A Vendor Report</h2>
      <div className="row mb-3">
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search Name / Email / Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={fetchCBAVs}>
            Apply Filters
          </button>
        </div>
        <div className="col-auto">
          <button className="btn btn-success" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading CBAVs...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="thead-dark">
              <tr>
                <th>Date / Time</th>
                <th>CBAV ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Platform</th>
                <th>Role</th>
                <th>Referred By</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Wallet</th>
                <th>Orders</th>
                <th>GST Type</th>
                <th>CGST ₹</th>
                <th>SGST ₹</th>
                <th>IGST ₹</th>
                <th>TotalGST ₹</th>
                <th>KYC</th>
                <th>Last Active</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cbavs.length > 0 ? (
                cbavs.map((cbav) => (
                  <tr key={cbav._id}>
                    <td>
                      {cbav.createdAt
                        ? new Date(cbav.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>{cbav._id}</td>
                    <td>{cbav.name}</td>
                    <td>{cbav.email}</td>
                    <td>{cbav.phone}</td>
                    <td>{cbav.platform}</td>
                    <td>{cbav.role}</td>
                    <td>{cbav.referredBy || "-"}</td>
                    <td>{cbav.zone}</td>
                    <td>{cbav.status}</td>
                    <td>₹{cbav.wallet || 0}</td>
                    <td>{cbav.orders || 0}</td>
                    <td>{cbav.gstType}</td>
                    <td>₹{cbav.cgst?.toFixed(2)}</td>
                    <td>₹{cbav.sgst?.toFixed(2)}</td>
                    <td>₹{cbav.igst?.toFixed(2)}</td>
                    <td>₹{cbav.totalGSTAmount?.toFixed(2)}</td>
                    <td>{cbav.kyc || "-"}</td>
                    <td>
                      {cbav.lastActive
                        ? new Date(cbav.lastActive).toLocaleString()
                        : "-"}
                    </td>
                    <td>{cbav.comments || "-"}</td>
                    <td>
                      <button className="btn btn-info btn-sm">Expand</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="text-center">
                    No CBAV records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerBecomeVendorReportPage;
