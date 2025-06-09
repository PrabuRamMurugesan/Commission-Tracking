import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Line, Bar } from "react-chartjs-2";
import "../styles/AISalesForecasting.css"; // Importing CSS

const AISalesForecasting = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchSalesForecast();
  }, [timeframe]);

  const fetchSalesForecast = async () => {
    try {
      const response = await axios.get(`/api/ai-sales-forecasting?timeframe=${timeframe}`);
      setForecastData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch sales forecast data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: forecastData.map((data) => data.date),
    datasets: [
      {
        label: "Projected Sales ($)",
        data: forecastData.map((data) => data.sales),
        backgroundColor: "#3498db",
        borderColor: "#2980b9",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ai-sales-forecasting-container">
      <Sidebar />
      <Container fluid className="ai-sales-forecasting-content">
        <h2 className="ai-sales-forecasting-title">📈 AI Sales Forecasting</h2>

        {/* Filter Section */}
        <Form.Group className="mb-3">
          <Form.Label>Select Timeframe</Form.Label>
          <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </Form.Control>
        </Form.Group>

        {/* Sales Forecast Chart */}
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
                    <h5>Sales Forecast Trend</h5>
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
                  <th>Projected Sales ($)</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.date}</td>
                    <td>${data.sales}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-sales-forecasting-container {
  display: flex;
  height: 100vh;
}

.ai-sales-forecasting-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-sales-forecasting-title {
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
  background-color: #1abc9c;
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

export default AISalesForecasting;
