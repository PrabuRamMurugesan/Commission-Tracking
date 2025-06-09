import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISuspiciousActivityMonitor.css"; // Importing CSS

const AISuspiciousActivityMonitor = () => {
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuspiciousActivities();
  }, []);

  const fetchSuspiciousActivities = async () => {
    try {
      const response = await axios.get("/api/ai-suspicious-activity-monitor");
      setSuspiciousActivities(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load suspicious activity data.");
      setLoading(false);
    }
  };

  const resolveSuspiciousActivity = async (activityId) => {
    try {
      await axios.post("/api/ai-suspicious-activity-monitor/resolve", { id: activityId });
      alert("Suspicious activity resolution initiated successfully!");
      fetchSuspiciousActivities();
    } catch (err) {
      console.error("Error resolving suspicious activity:", err);
    }
  };

  return (
    <div className="ai-suspicious-activity-container">
      <Sidebar />
      <Container fluid className="ai-suspicious-activity-content">
        <h2 className="ai-suspicious-activity-title">🔍 AI Suspicious Activity Monitor</h2>

        {/* Suspicious Activity Monitoring Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="suspicious-table mt-4">
            <thead>
              <tr>
                <th>Activity Type</th>
                <th>User</th>
                <th>Detected At</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {suspiciousActivities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.type}</td>
                  <td>{activity.user}</td>
                  <td>{new Date(activity.detectedAt).toLocaleString()}</td>
                  <td>
                    <ProgressBar
                      now={activity.riskLevel}
                      label={`${activity.riskLevel}%`}
                      variant={activity.riskLevel > 70 ? "danger" : activity.riskLevel > 40 ? "warning" : "success"}
                    />
                  </td>
                  <td>{activity.status}</td>
                  <td>
                    <Button variant="danger" onClick={() => resolveSuspiciousActivity(activity._id)} disabled={activity.status === "Resolved"}>
                      Resolve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-suspicious-activity-container {
  display: flex;
  height: 100vh;
}

.ai-suspicious-activity-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-suspicious-activity-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.suspicious-table th {
  background-color: #f39c12;
  color: white;
  text-align: center;
}

.suspicious-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISuspiciousActivityMonitor;
