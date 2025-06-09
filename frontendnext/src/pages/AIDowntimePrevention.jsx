import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIDowntimePrevention.css"; // Importing CSS

const AIDowntimePrevention = () => {
  const [downtimeData, setDowntimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDowntimeData();
  }, []);

  const fetchDowntimeData = async () => {
    try {
      const response = await axios.get("/api/ai-downtime-prevention");
      setDowntimeData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load downtime prevention data.");
      setLoading(false);
    }
  };

  const triggerPreventiveAction = async () => {
    try {
      await axios.post("/api/ai-downtime-prevention/trigger");
      alert("Preventive Action Triggered Successfully!");
      fetchDowntimeData();
    } catch (err) {
      console.error("Error triggering preventive action:", err);
    }
  };

  return (
    <div className="ai-downtime-prevention-container">
      <Sidebar />
      <Container fluid className="ai-downtime-prevention-content">
        <h2 className="ai-downtime-prevention-title">⚠️ AI Downtime Prevention</h2>

        <Button variant="primary" className="mb-3" onClick={triggerPreventiveAction}>
          Trigger Preventive Action
        </Button>

        {/* Downtime Prevention Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="downtime-table mt-4">
            <thead>
              <tr>
                <th>System Component</th>
                <th>Issue Detected</th>
                <th>Risk Level</th>
                <th>Preventive Action Status</th>
              </tr>
            </thead>
            <tbody>
              {downtimeData.map((data, index) => (
                <tr key={index}>
                  <td>{data.component}</td>
                  <td>{data.issue}</td>
                  <td>
                    <ProgressBar
                      now={data.riskLevel}
                      label={`${data.riskLevel}%`}
                      variant={data.riskLevel > 70 ? "danger" : data.riskLevel > 40 ? "warning" : "success"}
                    />
                  </td>
                  <td>{data.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-downtime-prevention-container {
  display: flex;
  height: 100vh;
}

.ai-downtime-prevention-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-downtime-prevention-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.downtime-table th {
  background-color: #8e44ad;
  color: white;
  text-align: center;
}

.downtime-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIDowntimePrevention;
