// pages/VendorReportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const VendorReportPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/reports/vendors", {
        params: { startDate, endDate, search },
      });
      // Controller returns { vendor: [...] }
      setVendors(response.data.vendor || response.data.vendors || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");
    XLSX.writeFile(workbook, "Vendor_Report.xlsx");
  };

  return (
    <div className="container  bg-light rounded shadow-sm p-4 m-5 border vw-100">
      <h2>Vendor Report</h2>
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
          <button className="btn btn-primary" onClick={fetchVendors}>
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
        <p>Loading vendors...</p>
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
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td>
                      {vendor.createdAt
                        ? new Date(vendor.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>{vendor.franchiseeId || "-"}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.phone}</td>
                    <td>{vendor.platform}</td>
                    <td>{vendor.role}</td>
                    <td>{vendor.referredBy || "-"}</td>
                    <td>{vendor.zone}</td>
                    <td>{vendor.status}</td>
                    <td>₹{vendor.walletBalance || 0}</td>
                    <td>{vendor.totalOrders || 0}</td>
                    <td>{vendor.gstType}</td>
                    <td>₹{vendor.cgst?.toFixed(2)}</td>
                    <td>₹{vendor.sgst?.toFixed(2)}</td>
                    <td>₹{vendor.igst?.toFixed(2)}</td>
                    <td>₹{vendor.totalGSTAmount?.toFixed(2)}</td>
                    <td>{vendor.kycStatus || "-"}</td>
                    <td>
                      {vendor.lastActive
                        ? new Date(vendor.lastActive).toLocaleString()
                        : "-"}
                    </td>
                    <td>{vendor.comments || "-"}</td>
                    <td>
                      <button className="btn btn-info btn-sm">Expand</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="text-center">
                    No vendor records found.
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

export default VendorReportPage;
 