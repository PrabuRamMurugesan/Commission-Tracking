import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const TransactionReportPage = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    platform: "",
    userRole: "",
    paymentMethod: "",
    transactionType: "",
    transactionCategory: "",
    search: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/reports/transactions", {
        params: filters,
      });
      console.log("✅ Transactions API Response:", data);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to fetch transactions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    // Placeholder: implement actual export to Excel logic
    alert("Export to Excel triggered");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content" style={{ padding: "7% 20px", width: "100%", overflowY: "auto" }}>
        <h2 className="mb-4">Transaction Report</h2>

      {/* Filters Section */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Date Range (Start)</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label>Date Range (End)</label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label>Platform</label>
          <input
            type="text"
            name="platform"
            className="form-control"
            value={filters.platform}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label>User Role</label>
          <input
            type="text"
            name="userRole"
            className="form-control"
            value={filters.userRole}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label>Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            className="form-control"
            value={filters.paymentMethod}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label>Txn Type</label>
          <select
            name="transactionType"
            className="form-control"
            value={filters.transactionType}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <div className="col-md-2">
          <label>Category</label>
          <input
            type="text"
            name="transactionCategory"
            className="form-control"
            value={filters.transactionCategory}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label>Search</label>
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Txn ID / Order ID / User"
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 align-self-end">
          <button className="btn btn-primary w-100" onClick={fetchTransactions}>
            Apply Filters
          </button>
        </div>
        <div className="col-md-2 align-self-end">
          <button className="btn btn-success w-100" onClick={handleExport}>
            Export to Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Date / Time</th>
              <th>Txn ID</th>
              <th>Order ID</th>
              <th>Platform</th>
              <th>User / Phone</th>
              <th>Role</th>
              <th>Type</th>
              <th>Category</th>
              <th>GST Type</th>
              <th>CGST ₹</th>
              <th>SGST ₹</th>
              <th>IGST ₹</th>
              <th>TotalGST ₹</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="14">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="14">{error}</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="14">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.date ? new Date(txn.date).toLocaleString() : txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "-"}</td>
                  <td>{txn.transactionId}</td>
                  <td>{txn.orderId || "-"}</td>
                  <td>{txn.platform}</td>
                  <td>
                    {txn.buyerName} / {txn.buyerPhone}
                  </td>
                  <td>{txn.sellerRole || "-"}</td>
                  <td>{txn.transactionType || "-"}</td>
                  <td>{txn.transactionCategory || "-"}</td>
                  <td>{txn.gstType || "-"}</td>
                  <td>₹{(txn.cgst || 0).toFixed(2)}</td>
                  <td>₹{(txn.sgst || 0).toFixed(2)}</td>
                  <td>₹{(txn.igst || 0).toFixed(2)}</td>
                  <td>₹{(txn.totalGSTAmount || 0).toFixed(2)}</td>
                  <td>₹{(txn.finalAmount || txn.amount || 0).toFixed(2)}</td>
                  <td>₹{txn.balanceAfter ? txn.balanceAfter.toFixed(2) : "-"}</td>
                  <td>{txn.paymentMethod || "-"}</td>
                  <td>{txn.status || "-"}</td>
                  <td>{txn.comments || "-"}</td>
                  <td>
                    <button className="btn btn-sm btn-info">Expand</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      <style>
        {`
          .dashboard-container {
            display: flex;
            height: 100vh;
            width: 100vw;
          }
          .dashboard-content {
            padding: 7% 20px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
          }
          @media (max-width: 768px) {
            .dashboard-container {
              flex-direction: column;
            }
            .dashboard-content {
              padding: 7rem 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TransactionReportPage;
