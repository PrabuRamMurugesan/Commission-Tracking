import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISecurityMonitor.css"; // Importing CSS

const AISecurityMonitor = () => {
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const fetchSecurityLogs = async () => {
    try {
      const response = await axios.get("/api/ai-security-monitor");
      setSecurityLogs(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load security logs.");
      setLoading(false);
    }
  };

  const triggerSecurityScan = async () => {
    try {
      await axios.post("/api/ai-security-monitor/scan");
      alert("AI Security Scan initiated successfully!");
      fetchSecurityLogs();
    } catch (err) {
      console.error("Error initiating security scan:", err);
    }
  };

  return (
    <div className="ai-security-monitor-container">
      <Sidebar />
      <Container fluid className="ai-security-monitor-content">
        <h2 className="ai-security-monitor-title">🛡️ AI Security Monitor</h2>

        <Button variant="danger" className="mb-3" onClick={triggerSecurityScan}>
          Run AI Security Scan
        </Button>

        {/* Security Logs Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="security-table mt-4">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {securityLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.timestamp}</td>
                  <td>{log.event}</td>
                  <td>
                    <Badge bg={log.severity === "High" ? "danger" : log.severity === "Medium" ? "warning" : "success"}>
                      {log.severity}
                    </Badge>
                  </td>
                  <td>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-security-monitor-container {
  display: flex;
  height: 100vh;
}

.ai-security-monitor-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-security-monitor-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.security-table th {
  background-color: #e74c3c;
  color: white;
  text-align: center;
}

.security-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISecurityMonitor;
