import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AILoadBalancer.css"; // Importing CSS

const AILoadBalancer = () => {
  const [loadMetrics, setLoadMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLoadMetrics();
  }, []);

  const fetchLoadMetrics = async () => {
    try {
      const response = await axios.get("/api/ai-load-balancer");
      setLoadMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load load-balancing metrics.");
      setLoading(false);
    }
  };

  const balanceLoad = async () => {
    try {
      await axios.post("/api/ai-load-balancer/balance");
      alert("AI Load Balancing initiated successfully!");
      fetchLoadMetrics();
    } catch (err) {
      console.error("Error balancing load:", err);
    }
  };

  return (
    <div className="ai-load-balancer-container">
      <Sidebar />
      <Container fluid className="ai-load-balancer-content">
        <h2 className="ai-load-balancer-title">⚖️ AI Load Balancer</h2>

        <Button variant="primary" className="mb-3" onClick={balanceLoad}>
          Optimize Load Distribution
        </Button>

        {/* Load Balancing Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="load-table mt-4">
            <thead>
              <tr>
                <th>Server Instance</th>
                <th>CPU Load (%)</th>
                <th>Memory Load (%)</th>
                <th>Load Distribution Status</th>
              </tr>
            </thead>
            <tbody>
              {loadMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.instance}</td>
                  <td>
                    <ProgressBar
                      now={metric.cpuLoad}
                      label={`${metric.cpuLoad}%`}
                      variant={metric.cpuLoad > 80 ? "danger" : metric.cpuLoad > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>
                    <ProgressBar
                      now={metric.memoryLoad}
                      label={`${metric.memoryLoad}%`}
                      variant={metric.memoryLoad > 80 ? "danger" : metric.memoryLoad > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>{metric.loadDistributionStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-load-balancer-container {
  display: flex;
  height: 100vh;
}

.ai-load-balancer-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-load-balancer-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.load-table th {
  background-color: #2c3e50;
  color: white;
  text-align: center;
}

.load-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AILoadBalancer;
