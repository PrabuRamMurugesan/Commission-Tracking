import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIPerformanceOptimizer.css"; // Importing CSS

const AIPerformanceOptimization = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPerformanceMetrics();
  }, []);

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await axios.get("/api/ai-performance-optimizer");
      setPerformanceMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load performance data.");
      setLoading(false);
    }
  };

  const optimizePerformance = async () => {
    try {
      await axios.post("/api/ai-performance-optimizer/optimize");
      alert("Performance optimization initiated successfully!");
      fetchPerformanceMetrics();
    } catch (err) {
      console.error("Error optimizing performance:", err);
    }
  };

  return (
    <div className="ai-performance-optimizer-container">
      <Sidebar />
      <Container fluid className="ai-performance-optimizer-content">
        <h2 className="ai-performance-optimizer-title">🚀 AI Performance Optimizer</h2>

        <Button variant="primary" className="mb-3" onClick={optimizePerformance}>
          Optimize System Performance
        </Button>

        {/* Performance Optimization Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="performance-table mt-4">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Usage (%)</th>
                <th>Status</th>
                <th>Optimization Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {performanceMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.name}</td>
                  <td>
                    <ProgressBar
                      now={metric.usage}
                      label={`${metric.usage}%`}
                      variant={metric.usage > 80 ? "danger" : metric.usage > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>{metric.status}</td>
                  <td>{metric.optimizationSuggestion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-performance-optimizer-container {
  display: flex;
  height: 100vh;
}

.ai-performance-optimizer-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-performance-optimizer-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.performance-table th {
  background-color: #3498db;
  color: white;
  text-align: center;
}

.performance-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIPerformanceOptimization;
