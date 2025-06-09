import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISystemHealthMonitor.css"; // Importing CSS

const AISystemHealthMonitor = () => {
  const [systemHealth, setSystemHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await axios.get("/api/ai-system-health-monitor");
      setSystemHealth(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load system health data.");
      setLoading(false);
    }
  };

  const optimizeSystem = async () => {
    try {
      await axios.post("/api/ai-system-health-monitor/optimize");
      alert("System optimization initiated successfully!");
      fetchSystemHealth();
    } catch (err) {
      console.error("Error optimizing system:", err);
    }
  };

  return (
    <div className="ai-system-health-container">
      <Sidebar />
      <Container fluid className="ai-system-health-content">
        <h2 className="ai-system-health-title">🖥️ AI System Health Monitor</h2>

        <Button variant="success" className="mb-3" onClick={optimizeSystem}>
          Optimize System
        </Button>

        {/* System Health Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="system-health-table mt-4">
            <thead>
              <tr>
                <th>Component</th>
                <th>Usage (%)</th>
                <th>Status</th>
                <th>Optimization Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {systemHealth.map((health, index) => (
                <tr key={index}>
                  <td>{health.component}</td>
                  <td>
                    <ProgressBar
                      now={health.usage}
                      label={`${health.usage}%`}
                      variant={health.usage > 80 ? "danger" : health.usage > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>{health.status}</td>
                  <td>{health.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-system-health-container {
  display: flex;
  height: 100vh;
}

.ai-system-health-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-system-health-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.system-health-table th {
  background-color: #1abc9c;
  color: white;
  text-align: center;
}

.system-health-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISystemHealthMonitor;
