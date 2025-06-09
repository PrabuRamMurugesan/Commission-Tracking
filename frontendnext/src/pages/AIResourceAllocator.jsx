import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIResourceAllocator.css"; // Importing CSS

const AIResourceAllocator = () => {
  const [resourceMetrics, setResourceMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResourceMetrics();
  }, []);

  const fetchResourceMetrics = async () => {
    try {
      const response = await axios.get("/api/ai-resource-allocator");
      setResourceMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load resource allocation data.");
      setLoading(false);
    }
  };

  const optimizeResources = async () => {
    try {
      await axios.post("/api/ai-resource-allocator/optimize");
      alert("AI Resource Optimization initiated successfully!");
      fetchResourceMetrics();
    } catch (err) {
      console.error("Error optimizing resources:", err);
    }
  };

  return (
    <div className="ai-resource-allocator-container">
      <Sidebar />
      <Container fluid className="ai-resource-allocator-content">
        <h2 className="ai-resource-allocator-title">🔧 AI Resource Allocator</h2>

        <Button variant="primary" className="mb-3" onClick={optimizeResources}>
          Optimize Resource Allocation
        </Button>

        {/* Resource Allocation Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="resource-table mt-4">
            <thead>
              <tr>
                <th>Server Instance</th>
                <th>CPU Allocation (%)</th>
                <th>Memory Allocation (%)</th>
                <th>Optimization Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {resourceMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.instance}</td>
                  <td>
                    <ProgressBar
                      now={metric.cpuAllocation}
                      label={`${metric.cpuAllocation}%`}
                      variant={metric.cpuAllocation > 80 ? "danger" : metric.cpuAllocation > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>
                    <ProgressBar
                      now={metric.memoryAllocation}
                      label={`${metric.memoryAllocation}%`}
                      variant={metric.memoryAllocation > 80 ? "danger" : metric.memoryAllocation > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>{metric.optimizationSuggestion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-resource-allocator-container {
  display: flex;
  height: 100vh;
}

.ai-resource-allocator-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-resource-allocator-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.resource-table th {
  background-color: #1abc9c;
  color: white;
  text-align: center;
}

.resource-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIResourceAllocator;
