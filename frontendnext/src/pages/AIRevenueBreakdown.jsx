import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Doughnut, Bar } from "react-chartjs-2";
import "../styles/AIRevenueBreakdown.css"; // Importing CSS

const AIRevenueBreakdown = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRevenueBreakdown();
  }, []);

  const fetchRevenueBreakdown = async () => {
    try {
      const response = await axios.get("/api/ai-revenue-breakdown");
      setRevenueData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch revenue data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: revenueData.map((data) => data.source),
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData.map((data) => data.amount),
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"],
      },
    ],
  };

  return (
    <div className="ai-revenue-breakdown-container">
      <Sidebar />
      <Container fluid className="ai-revenue-breakdown-content">
        <h2 className="ai-revenue-breakdown-title">📊 AI Revenue Breakdown</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            {/* Revenue Breakdown Charts */}
            <Row>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Revenue Distribution</h5>
                    <Doughnut data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Revenue by Category</h5>
                    <Bar data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Revenue Breakdown Table */}
            <Table striped bordered hover responsive className="revenue-table mt-4">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Amount ($)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.source}</td>
                    <td>${data.amount}</td>
                    <td>
                      <Badge bg="info">{data.percentage}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-revenue-breakdown-container {
  display: flex;
  height: 100vh;
}

.ai-revenue-breakdown-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-revenue-breakdown-title {
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
  background-color: #1abc9c;
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

export default AIRevenueBreakdown;
