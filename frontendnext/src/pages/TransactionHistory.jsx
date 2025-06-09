import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions");

      // Correctly extract the transactions array
      const transactionsData = response.data.transactions || response.data;

      if (Array.isArray(transactionsData)) {
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
      } else {
        throw new Error("Invalid transaction data format.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = transactions;
    if (status) {
      filtered = filtered.filter(txn => txn.status === status);
    }
    if (date) {
      filtered = filtered.filter(txn => new Date(txn.date).toISOString().split("T")[0] === date);
    }
    setFilteredTransactions(filtered);
  };

  const handleResetFilters = () => {
    setDate("");
    setStatus("");
    setFilteredTransactions(transactions);
  };

  const handleDownloadCSV = () => {
    const csvData = filteredTransactions.map(txn => ({
      Date: new Date(txn.date).toLocaleDateString(),
      Amount: txn.amount,
      Status: txn.status,
    }));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,Amount,Status", ...csvData.map(row => Object.values(row).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TransactionHistory.csv");
    document.body.appendChild(link);
    link.click();
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
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </Form.Control>
        <Button variant="primary" onClick={handleFilter}>
          Apply Filters
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
      ) : Array.isArray(filteredTransactions) && filteredTransactions.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>${txn.amount}</td>
                <td>
                  <span
                    className={
                      txn.status === "Completed"
                        ? "status-completed"
                        : txn.status === "Pending"
                        ? "status-pending"
                        : "status-failed"
                    }
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No transactions found.</Alert>
      )}

      {/* Inline Styling */}
      <style>
        {`
        /* Transaction History Styling */
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
  flex: 1 1 150px;
  padding: 10px;
  border-radius: 5px;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #2980b9;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.status-pending {
  background-color: #f1c40f;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.status-completed {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.status-failed {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

@media (max-width: 1020px) {
  .transaction-history-container {
    padding: 7rem 20px;
  }
  .filters {
    flex-direction: column;
  }
  .filters select, .filters input {
    width: 100%;
  }
}        `}
      </style>
    </div>
    </div>
  );
};

export default TransactionHistory;
