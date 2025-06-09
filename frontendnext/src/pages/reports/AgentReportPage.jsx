// pages/AgentReportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const AgentReportPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get("/api/reports/agents", {
        params: { startDate, endDate, search },
      });
      setAgents(res.data.agents || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch agents", err);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(agents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");
    XLSX.writeFile(workbook, "Agent_Report.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2>Agents Report</h2>

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
          <button className="btn btn-primary" onClick={fetchAgents}>
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
        <p>Loading agents...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="thead-dark">
              <tr>
                <th>Date / Time</th>
                <th>Agent ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>WhatsApp No</th>
                <th>Role</th>
                <th>Platform</th>
                <th>Franchisee ID</th>
                <th>BP Code</th>
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
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{new Date(agent.createdAt).toLocaleString()}</td>
                    <td>{agent._id}</td>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone}</td>
                    <td>{agent.whatsappNumber}</td>
                    <td>{agent.designation}</td>
                    <td>{agent.platform}</td>
                    <td>{agent.franchiseeId || "-"}</td>
                    <td>{agent.businessPartnerCode || "-"}</td>
                    <td>{agent.zone}</td>
                    <td>{agent.accountStatus}</td>
                    <td>₹{agent?.commissionRates?.[0]?.walletBalance || 0}</td>
                    <td>{agent?.commissionRates?.[0]?.totalOrders || 0}</td>
                    <td>{agent.gstType}</td>
                    <td>₹{agent.cgst?.toFixed(2)}</td>
                    <td>₹{agent.sgst?.toFixed(2)}</td>
                    <td>₹{agent.igst?.toFixed(2)}</td>
                    <td>₹{agent.totalGSTAmount?.toFixed(2)}</td>
                    <td>{agent.kycStatus || "-"}</td>
                    <td>
                      {agent.lastActive
                        ? new Date(agent.lastActive).toLocaleString()
                        : "-"}
                    </td>
                    <td>{agent.comments || "-"}</td>
                    <td>
                      <button className="btn btn-info btn-sm">Expand</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="18" className="text-center">
                    No agent records found.
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

export default AgentReportPage;
