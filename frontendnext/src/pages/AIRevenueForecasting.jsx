import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Line } from "react-chartjs-2";
import "../styles/AIRevenueForecasting.css"; // Importing CSS

const AIRevenueForecasting = () => {
  const [revenueForecast, setRevenueForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRevenueForecast();
  }, []);

  const fetchRevenueForecast = async () => {
    try {
      const response = await axios.get("/api/ai-revenue-forecasting");
      setRevenueForecast(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch revenue forecasting data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: revenueForecast.map(data => data.date),
    datasets: [
      {
        label: "Projected Revenue ($)",
        data: revenueForecast.map(data => data.forecastedRevenue),
        backgroundColor: "#2ecc71",
        borderColor: "#27ae60",
        fill: true,
      },
    ],
  };

  return (
    <div className="ai-revenue-forecasting-container">
      <Sidebar />
      <Container fluid className="ai-revenue-forecasting-content">
        <h2 className="ai-revenue-forecasting-title">📈 AI Revenue Forecasting</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            {/* Revenue Forecast Chart */}
            <Row>
              <Col md={8}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Projected Revenue Growth</h5>
                    <Line data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Forecast Data Table */}
            <Table striped bordered hover responsive className="forecast-table mt-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Projected Revenue ($)</th>
                  <th>Growth Rate (%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {revenueForecast.map((data, index) => (
                  <tr key={index}>
                    <td>{data.date}</td>
                    <td>${data.forecastedRevenue}</td>
                    <td>
                      <Badge bg={data.growthRate >= 0 ? "success" : "danger"}>
                        {data.growthRate}%
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={data.status === "Growing" ? "primary" : "warning"}>
                        {data.status}
                      </Badge>
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
        .ai-revenue-forecasting-container {
  display: flex;
  height: 100vh;
}

.ai-revenue-forecasting-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-revenue-forecasting-title {
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

.forecast-table th {
  background-color: #2980b9;
  color: white;
  text-align: center;
}

.forecast-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIRevenueForecasting;
