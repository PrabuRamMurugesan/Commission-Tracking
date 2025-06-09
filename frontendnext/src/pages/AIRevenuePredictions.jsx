import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Line, Bar } from "react-chartjs-2";
import "../styles/AIRevenuePredictions.css"; // Importing CSS

const AIRevenuePredictions = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchRevenuePredictions();
  }, [timeframe]);

  const fetchRevenuePredictions = async () => {
    try {
      const response = await axios.get(`/api/ai-revenue-predictions?timeframe=${timeframe}`);
      setRevenueData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch revenue prediction data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: revenueData.map((data) => data.date),
    datasets: [
      {
        label: "Projected Revenue ($)",
        data: revenueData.map((data) => data.revenue),
        backgroundColor: "#2ecc71",
        borderColor: "#27ae60",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ai-revenue-predictions-container">
      <Sidebar />
      <Container fluid className="ai-revenue-predictions-content">
        <h2 className="ai-revenue-predictions-title">📊 AI Revenue Predictions</h2>

        {/* Filter Section */}
        <Form.Group className="mb-3">
          <Form.Label>Select Timeframe</Form.Label>
          <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </Form.Control>
        </Form.Group>

        {/* Revenue Forecast Chart */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            <Row>
              <Col md={12}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Revenue Forecast Trend</h5>
                    <Line data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Revenue Data Table */}
            <Table striped bordered hover responsive className="revenue-table mt-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Projected Revenue ($)</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.date}</td>
                    <td>${data.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-revenue-predictions-container {
  display: flex;
  height: 100vh;
}

.ai-revenue-predictions-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-revenue-predictions-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.revenue-table th {
  background-color: #16a085;
  color: white;
  text-align: center;
}

.revenue-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIRevenuePredictions;
