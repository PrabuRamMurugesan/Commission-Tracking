import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISalesPredictor.css"; // Importing CSS

const AISalesPredictor = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchSalesPredictions();
  }, [timeframe]);

  const fetchSalesPredictions = async () => {
    try {
      const response = await axios.get(`/api/ai-sales-predictor?timeframe=${timeframe}`);
      setSalesData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load sales prediction data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData.map((data) => data.date),
    datasets: [
      {
        label: "Predicted Sales ($)",
        data: salesData.map((data) => data.predictedSales),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="ai-sales-predictor-container">
      <Sidebar />
      <Container fluid className="ai-sales-predictor-content">
        <h2 className="ai-sales-predictor-title">📈 AI Sales Predictor</h2>

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

        {/* Sales Forecast Chart */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="sales-chart">
            <Line data={chartData} />
          </div>
        )}

        {/* Sales Prediction Data Table */}
        {!loading && !error && (
          <Table striped bordered hover responsive className="sales-table mt-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Predicted Sales ($)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index}>
                  <td>{data.date}</td>
                  <td>{data.predictedSales}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-sales-predictor-container {
  display: flex;
  height: 100vh;
}

.ai-sales-predictor-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-sales-predictor-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.sales-chart {
  margin-bottom: 30px;
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

export default AISalesPredictor;
