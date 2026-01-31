// pages/FranchiseeReportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const FranchiseeReportPage = () => {
  const [franchisees, setFranchisees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchFranchisees();
  }, []);

  const fetchFranchisees = async () => {
    try {
      const response = await axios.get("/api/reports/franchisees", {
        params: { startDate, endDate, search },
      });
      // Controller returns { francise: [...] }
      setFranchisees(response.data.francise || response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching franchisees:", error);
      setFranchisees([]);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(franchisees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Franchisees");
    XLSX.writeFile(workbook, "FranchiseeReport.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2>Franchisee Report</h2>
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
          <button className="btn btn-primary" onClick={fetchFranchisees}>
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
        <p>Loading franchisees...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="thead-dark">
              <tr>
                <th>Date / Time</th>
                <th>Franchisee ID</th>
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
              {franchisees.length > 0 ? (
                franchisees.map((f) => (
                  <tr key={f._id}>
                    <td>{new Date(f.createdAt).toLocaleString()}</td>
                    <td>{f.franchiseeId || "-"}</td>
                    <td>{f.name}</td>
                    <td>{f.email}</td>
                    <td>{f.phone}</td>
                    <td>{f.platform}</td>
                    <td>{f.role || "Franchise"}</td>
                    <td>{f.referredBy || "-"}</td>
                    <td>{f.zone}</td>
                    <td>{f.status}</td>
                    <td>₹{f.walletBalance || 0}</td>
                    <td>{f.totalOrders || 0}</td>
                    <td>{f.gstType}</td>
                    <td>₹{f.cgst?.toFixed(2)}</td>
                    <td>₹{f.sgst?.toFixed(2)}</td>
                    <td>₹{f.igst?.toFixed(2)}</td>
                    <td>₹{f.totalGSTAmount?.toFixed(2)}</td>
                    <td>{f.kycStatus || "-"}</td>
                    <td>
                      {f.lastActive
                        ? new Date(f.lastActive).toLocaleString()
                        : "-"}
                    </td>
                    <td>{f.comments || "-"}</td>
                    <td>
                      <button className="btn btn-info btn-sm">Expand</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="text-center">
                    No franchisee records found.
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

export default FranchiseeReportPage;
