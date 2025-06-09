import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIServerHealthMonitor.css"; // Importing CSS

const AIServerHealthMonitor = () => {
  const [serverHealth, setServerHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServerHealth();
  }, []);

  const fetchServerHealth = async () => {
    try {
      const response = await axios.get("/api/ai-server-health");
      setServerHealth(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load server health data.");
      setLoading(false);
    }
  };

  const refreshHealthStatus = async () => {
    try {
      await axios.post("/api/ai-server-health/refresh");
      alert("Server health status refreshed successfully!");
      fetchServerHealth();
    } catch (err) {
      console.error("Error refreshing server health:", err);
    }
  };

  return (
    <div className="ai-server-health-container">
      <Sidebar />
      <Container fluid className="ai-server-health-content">
        <h2 className="ai-server-health-title">🖥️ AI Server Health Monitor</h2>

        <Button variant="primary" className="mb-3" onClick={refreshHealthStatus}>
          Refresh Health Status
        </Button>

        {/* Server Health Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="server-health-table mt-4">
            <thead>
              <tr>
                <th>Server Instance</th>
                <th>CPU Load (%)</th>
                <th>Memory Usage (%)</th>
                <th>Disk Space (%)</th>
                <th>Uptime (Days)</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {serverHealth.map((server, index) => (
                <tr key={index}>
                  <td>{server.instance}</td>
                  <td>
                    <ProgressBar
                      now={server.cpuLoad}
                      label={`${server.cpuLoad}%`}
                      variant={server.cpuLoad > 80 ? "danger" : server.cpuLoad > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>
                    <ProgressBar
                      now={server.memoryUsage}
                      label={`${server.memoryUsage}%`}
                      variant={server.memoryUsage > 80 ? "danger" : server.memoryUsage > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>
                    <ProgressBar
                      now={server.diskSpace}
                      label={`${server.diskSpace}%`}
                      variant={server.diskSpace > 80 ? "danger" : server.diskSpace > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>{server.uptime}</td>
                  <td>{server.healthStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-server-health-container {
  display: flex;
  height: 100vh;
}

.ai-server-health-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-server-health-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.server-health-table th {
  background-color: #34495e;
  color: white;
  text-align: center;
}

.server-health-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIServerHealthMonitor;
