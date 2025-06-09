import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISystemPerformance.css"; // Importing CSS

const AISystemPerformance = () => {
  const [systemMetrics, setSystemMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSystemPerformance();
  }, []);

  const fetchSystemPerformance = async () => {
    try {
      const response = await axios.get("/api/ai-system-performance");
      setSystemMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load system performance metrics.");
      setLoading(false);
    }
  };

  const optimizeSystemPerformance = async () => {
    try {
      await axios.post("/api/ai-system-performance/optimize");
      alert("AI System Performance Optimization initiated successfully!");
      fetchSystemPerformance();
    } catch (err) {
      console.error("Error optimizing system performance:", err);
    }
  };

  return (
    <div className="ai-system-performance-container">
      <Sidebar />
      <Container fluid className="ai-system-performance-content">
        <h2 className="ai-system-performance-title">⚙️ AI System Performance Monitor</h2>

        <Button variant="primary" className="mb-3" onClick={optimizeSystemPerformance}>
          Optimize System Performance
        </Button>

        {/* System Performance Metrics Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="system-table mt-4">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current Value</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {systemMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.metricName}</td>
                  <td>
                    <ProgressBar
                      now={metric.currentValue}
                      label={`${metric.currentValue}%`}
                      variant={metric.currentValue > metric.threshold ? "danger" : "success"}
                    />
                  </td>
                  <td>{metric.threshold}%</td>
                  <td>{metric.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-system-performance-container {
  display: flex;
  height: 100vh;
}

.ai-system-performance-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-system-performance-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.system-table th {
  background-color: #8e44ad;
  color: white;
  text-align: center;
}

.system-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISystemPerformance;
