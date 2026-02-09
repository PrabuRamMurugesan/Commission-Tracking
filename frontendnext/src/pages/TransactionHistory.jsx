import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Table, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [status, setStatus] = useState(""); // we will filter by paymentStatus OR orderStatus OR status

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        "";

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // ✅ IMPORTANT: call relative URL so Vite proxy forwards to 5000
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const { data } = await axios.get(
  `${API_BASE}/api/transactions`,
  { headers }
);

      // Your API returns: { page, limit, total, totalPages, items: [...] }
const list = Array.isArray(data?.transactions)
  ? data.transactions
  : [];

      setTransactions(list);
    } catch (err) {
      console.error("Fetch transactions error:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load transaction data."
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (status) {
      filtered = filtered.filter((t) => {
        const s1 = String(t.paymentStatus || "").toLowerCase();
        const s2 = String(t.orderStatus || "").toLowerCase();
        const s3 = String(t.status || "").toLowerCase();
        const wanted = String(status).toLowerCase();
        return s1 === wanted || s2 === wanted || s3 === wanted;
      });
    }

    if (date) {
      filtered = filtered.filter((t) => {
        const d = t.date || t.createdAt;
        if (!d) return false;
        return new Date(d).toISOString().split("T")[0] === String(date);
      });
    }

    return filtered;
  }, [transactions, status, date]);

  const handleResetFilters = () => {
    setDate("");
    setStatus("");
  };

  const handleDownloadCSV = () => {
    const rows = filteredTransactions.map((t) => ({
      Date: new Date(t.date || t.createdAt || Date.now()).toLocaleString(),
      OrderId: t.orderId || "",
      TransactionId: t.transactionId || "",
      Platform: t.platform || "",
      Amount: t.amount ?? "",
      FinalAmount: t.finalAmount ?? "",
      PaymentStatus: t.paymentStatus || "",
      OrderStatus: t.orderStatus || "",
      Status: t.status || "",
    }));

    const header = Object.keys(rows[0] || {}).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + body;

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "TransactionHistory.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="transaction-history-page">
      <Sidebar />
      <div className="transaction-history-container">
        <h2 className="text-primary mb-4">📜 Transaction History</h2>

        <div className="filters">
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Form.Control
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="paid">paid</option>
            <option value="failed">failed</option>
            <option value="escrow">escrow</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
            <option value="returned">returned</option>
            <option value="success">success</option>
            <option value="pending">pending</option>
            <option value="on-hold">on-hold</option>
          </Form.Control>

          <Button variant="primary" onClick={fetchTransactions}>
            Refresh
          </Button>

          <Button variant="secondary" onClick={handleResetFilters}>
            Reset Filters
          </Button>

          <Button variant="success" onClick={handleDownloadCSV}>
            Download CSV
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading transactions...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredTransactions.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Order ID</th>
                <th>Transaction ID</th>
                <th>Platform</th>
                <th>Amount</th>
                <th>Final Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date || t.createdAt).toLocaleString()}</td>
                  <td>{t.orderId}</td>
                  <td>{t.transactionId}</td>
                  <td>{t.platform}</td>
                  <td>{t.amount}</td>
                  <td>{t.finalAmount}</td>
                  <td>{t.paymentStatus}</td>
                  <td>{t.orderStatus}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">No transactions found.</Alert>
        )}

        <style>
          {`
          .transaction-history-page{
            display: flex;
            width: 100vw;
            height: 100vh;
          }
          .transaction-history-container {
            padding: 7% 20px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
          }
          .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
          }
          .filters select, .filters input {
            flex: 1;
            min-width: 200px;
          }
        `}
        </style>
      </div>
    </div>
  );
}
