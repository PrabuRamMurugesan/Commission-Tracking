import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIIncidentResponse.css"; // Importing CSS

const AIIncidentResponse = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncidentReports();
  }, []);

  const fetchIncidentReports = async () => {
    try {
      const response = await axios.get("/api/ai-incident-response");
      setIncidents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load incident reports.");
      setLoading(false);
    }
  };

  const triggerIncidentResponse = async () => {
    try {
      await axios.post("/api/ai-incident-response/resolve");
      alert("AI Incident Response initiated successfully!");
      fetchIncidentReports();
    } catch (err) {
      console.error("Error triggering AI incident response:", err);
    }
  };

  return (
    <div className="ai-incident-response-container">
      <Sidebar />
      <Container fluid className="ai-incident-response-content">
        <h2 className="ai-incident-response-title">🚨 AI Incident Response</h2>

        <Button variant="danger" className="mb-3" onClick={triggerIncidentResponse}>
          Trigger AI Incident Response
        </Button>

        {/* Incident Reports Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="incident-table mt-4">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Incident Type</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, index) => (
                <tr key={index}>
                  <td>{incident.timestamp}</td>
                  <td>{incident.type}</td>
                  <td>
                    <Badge bg={incident.severity === "High" ? "danger" : incident.severity === "Medium" ? "warning" : "success"}>
                      {incident.severity}
                    </Badge>
                  </td>
                  <td>{incident.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-incident-response-container {
  display: flex;
  height: 100vh;
}

.ai-incident-response-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-incident-response-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.incident-table th {
  background-color: #c0392b;
  color: white;
  text-align: center;
}

.incident-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIIncidentResponse;
