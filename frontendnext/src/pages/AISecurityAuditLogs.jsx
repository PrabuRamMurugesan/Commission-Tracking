import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISecurityAuditLogs.css"; // Importing CSS

const AISecurityAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get(`/api/ai-security-audit-logs?filter=${filter}`);
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch security audit logs.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-security-audit-logs-container">
      <Sidebar />
      <Container fluid className="ai-security-audit-logs-content">
        <h2 className="ai-security-audit-logs-title">🔍 AI Security Audit Logs</h2>

        {/* Filter Section */}
        <Form.Group className="mb-3">
          <Form.Label>Filter Logs</Form.Label>
          <Form.Control as="select" onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Login Attempts">Login Attempts</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
            <option value="Data Modifications">Data Modifications</option>
          </Form.Control>
          <Button className="mt-2" variant="primary" onClick={fetchAuditLogs}>
            Apply Filter
          </Button>
        </Form.Group>

        {/* Audit Logs Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="audit-log-table mt-4">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.timestamp}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.ip}</td>
                  <td>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-security-audit-logs-container {
  display: flex;
  height: 100vh;
}

.ai-security-audit-logs-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-security-audit-logs-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.audit-log-table th {
  background-color: #e74c3c;
  color: white;
  text-align: center;
}

.audit-log-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISecurityAuditLogs;
