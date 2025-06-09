import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AITransactionFraudDetection.css"; // Importing CSS

const AITransactionFraudDetection = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFraudulentTransactions();
  }, []);

  const fetchFraudulentTransactions = async () => {
    try {
      const response = await axios.get("/api/ai-transaction-fraud-detection");
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch fraudulent transactions.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-transaction-fraud-container">
      <Sidebar />
      <Container fluid className="ai-transaction-fraud-content">
        <h2 className="ai-transaction-fraud-title">🔍 AI-Powered Fraud Detection</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="fraud-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Amount ($)</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.user}</td>
                  <td>${transaction.amount}</td>
                  <td>
                    <Badge bg={transaction.riskScore > 80 ? "danger" : transaction.riskScore > 50 ? "warning" : "success"}>
                      {transaction.riskScore}%
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={transaction.status === "Flagged" ? "warning" : "success"}>
                      {transaction.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="danger" size="sm">Investigate</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-transaction-fraud-container {
  display: flex;
  height: 100vh;
}

.ai-transaction-fraud-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-transaction-fraud-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.fraud-table th {
  background-color: #c0392b;
  color: white;
  text-align: center;
}

.fraud-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AITransactionFraudDetection;
