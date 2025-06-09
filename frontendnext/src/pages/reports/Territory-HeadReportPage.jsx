// pages/Territory-HeadReportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const TerritoryHeadReportPage = () => {
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchTerritories();
  }, []);

  const fetchTerritories = async () => {
    try {
      const res = await axios.get("/api/reports/Territory-HeadReport", {
        params: { startDate, endDate, search },
      });
      setTerritories(res.data.territories || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(territories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Territories");
    XLSX.writeFile(workbook, "TerritoryHead_Report.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2>Territory Head Report</h2>

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
          <button className="btn btn-primary" onClick={fetchTerritories}>
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
        <p>Loading territory heads...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="thead-dark">
              <tr>
                <th>Date / Time</th>
                <th>Territory ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>WhatsApp No</th>
                <th>Role</th>
                <th>Platform</th>
                <th>Franchisee ID</th>
                <th>BP Code</th>
                <th>Zone</th>
                <th>State</th>
                <th>City</th>
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
              {territories.length > 0 ? (
                territories.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                    <td>{t._id}</td>
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.phone}</td>
                    <td>{t.whatsappNumber}</td>
                    <td>{t.designation}</td>
                    <td>{t.platform}</td>
                    <td>{t.franchiseeId}</td>
                    <td>{t.businessPartnerCode}</td>
                    <td>{t.zone}</td>
                    <td>{t.stateCode}</td>
                    <td>{t.cityCode}</td>
                    <td>{t.accountStatus}</td>
                    <td>₹{t?.commissionRates?.[0]?.walletBalance || 0}</td>
                    <td>{t?.commissionRates?.[0]?.totalOrders || 0}</td>
                    <td>{t.gstType}</td>
                    <td>₹{t.cgst?.toFixed(2)}</td>
                    <td>₹{t.sgst?.toFixed(2)}</td>
                    <td>₹{t.igst?.toFixed(2)}</td>
                    <td>₹{t.totalGSTAmount?.toFixed(2)}</td>
                    <td>{t.kycStatus || "-"}</td>
                    <td>
                      {t.lastActive
                        ? new Date(t.lastActive).toLocaleString()
                        : "-"}
                    </td>
                    <td>{t.comments || "-"}</td>
                    <td>
                      <button className="btn btn-info btn-sm">Expand</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="20" className="text-center">
                    No records found.
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

export default TerritoryHeadReportPage;
