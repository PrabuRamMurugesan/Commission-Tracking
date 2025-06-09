import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button, Card, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AICustomerInsights = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insightType, setInsightType] = useState("Engagement");

  useEffect(() => {
    fetchCustomerInsights();
  }, [insightType]);

  const fetchCustomerInsights = async () => {
    setLoading(true);
    setError(""); // Reset the error message when starting a new request

    try {
      const response = await axios.get(`/api/ai-customer-insights?type=${insightType}`);
      
      // Check if the response data is an array
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        throw new Error("Data format is not an array");
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load customer insights.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-customer-insights-container">
      <Sidebar />
      <Container fluid className="ai-customer-insights-content">
        <h2 className="ai-customer-insights-title">📊 AI Customer Insights</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Insight Type</Form.Label>
            <Form.Select value={insightType} onChange={(e) => setInsightType(e.target.value)}>
              <option value="Engagement">Engagement</option>
              <option value="Purchase Behavior">Purchase Behavior</option>
              <option value="Support Interactions">Support Interactions</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {/* Customer Insights Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="customer-table mt-4">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Last Purchase</th>
                <th>Activity Level</th>
                <th>Preferred Channel</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.lastPurchase}</td>
                  <td>
                    <Badge bg={customer.activity === "High" ? "success" : customer.activity === "Medium" ? "warning" : "danger"}>
                      {customer.activity}
                    </Badge>
                  </td>
                  <td>{customer.preferredChannel}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-customer-insights-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.ai-customer-insights-content {
  flex-grow: 1;
  padding: 8% 20px;
  background-color: #f8f9fa;
}

.ai-customer-insights-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.customer-table th {
  background-color: #673ab7;
  color: white;
  text-align: center;
}

.customer-table td {
  text-align: center;
  padding: 10px;
}
  @media (max-width: 768px) {
    .ai-customer-insights-content {
      padding: 8rem 20px;
    }
  }
`}</style>
    </div>
  );
};
  
export default AICustomerInsights;
