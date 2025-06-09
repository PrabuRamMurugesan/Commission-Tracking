import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AgentSelfService = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payoutRequest, setPayoutRequest] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/agent-transactions");
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions.");
      setLoading(false);
    }
  };

  const handlePayoutRequest = async () => {
    try {
      await axios.post("/api/agent-request-payout");
      setPayoutRequest(true);
    } catch (error) {
      console.error("Error requesting payout:", error);
      setError("Failed to process payout request.");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Agent Earnings Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Customer", "Sales Amount", "Commission"]],
      body: transactions.map(txn => [
        txn.date,
        txn.customer,
        `$${txn.salesAmount}`,
        `$${txn.commission}`,
      ]),
    });
    doc.save("agent-earnings.pdf");
  };

  return (
    <div className="agent-selfservice-container">
      <h2 className="text-primary mb-4">👤 Agent Self-Service Portal</h2>

      <div className="export-buttons">
        <CSVLink data={transactions} filename="agent-earnings.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      <div className="payout-section">
        <Button variant="primary" onClick={handlePayoutRequest} disabled={payoutRequest}>
          {payoutRequest ? "Payout Requested" : "Request Payout"}
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading transactions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Sales Amount</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>{txn.customer}</td>
                <td>${txn.salesAmount}</td>
                <td>${txn.commission}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Agent Self-Service Styling */
.agent-selfservice-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.export-buttons {
  margin: 20px 0;
}

.payout-section {
  margin-top: 20px;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

@media (max-width: 768px) {
  .export-buttons, .payout-section {
    flex-direction: column;
  }
}
`}
      </style>
    </div>
  );
};

export default AgentSelfService;
