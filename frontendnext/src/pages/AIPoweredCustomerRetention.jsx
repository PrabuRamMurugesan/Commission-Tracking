import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIPoweredCustomerRetention.css"; // Importing CSS

const AIPoweredCustomerRetention = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRetentionData();
  }, []);

  const fetchRetentionData = async () => {
    try {
      const response = await axios.get("/api/ai-customer-retention");
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch customer retention data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-customer-retention-container">
      <Sidebar />
      <Container fluid className="ai-customer-retention-content">
        <h2 className="ai-customer-retention-title">🛍️ AI-Powered Customer Retention</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="retention-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Last Purchase</th>
                <th>Engagement Score</th>
                <th>Retention Strategy</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.customerId}</td>
                  <td>{customer.name}</td>
                  <td>{customer.lastPurchase}</td>
                  <td>
                    <Badge bg={customer.engagementScore > 80 ? "success" : customer.engagementScore > 50 ? "warning" : "danger"}>
                      {customer.engagementScore}%
                    </Badge>
                  </td>
                  <td>{customer.retentionStrategy}</td>
                  <td>
                    <Button variant="primary" size="sm">Send Offer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-customer-retention-container {
  display: flex;
  height: 100vh;
}

.ai-customer-retention-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-customer-retention-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.retention-table th {
  background-color: #16a085;
  color: white;
  text-align: center;
}

.retention-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIPoweredCustomerRetention;
