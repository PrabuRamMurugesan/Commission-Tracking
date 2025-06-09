import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISalesOptimizer.css"; // Importing CSS

const AISalesOptimizer = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchSalesData();
  }, [timeframe]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`/api/ai-sales-optimizer?timeframe=${timeframe}`);
      setSalesData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load sales optimization data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-sales-optimizer-container">
      <Sidebar />
      <Container fluid className="ai-sales-optimizer-content">
        <h2 className="ai-sales-optimizer-title">📊 AI Sales Optimization</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Timeframe</Form.Label>
            <Form.Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {/* Sales Data Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="sales-table mt-4">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sales Volume</th>
                <th>Revenue ($)</th>
                <th>Profit Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index}>
                  <td>{data.product}</td>
                  <td>{data.salesVolume}</td>
                  <td>{data.revenue}</td>
                  <td>{data.profitMargin}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-sales-optimizer-container {
  display: flex;
  height: 100vh;
}

.ai-sales-optimizer-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-sales-optimizer-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.sales-table th {
  background-color: #3498db;
  color: white;
  text-align: center;
}

.sales-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISalesOptimizer;
