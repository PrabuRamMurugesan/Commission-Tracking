import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIThreatDetection.css"; // Importing CSS

const AIThreatDetection = () => {
  const [threatData, setThreatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchThreatData();
  }, []);

  const fetchThreatData = async () => {
    try {
      const response = await axios.get("/api/ai-threat-detection");
      setThreatData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load threat detection data.");
      setLoading(false);
    }
  };

  const mitigateThreat = async (threatId) => {
    try {
      await axios.post("/api/ai-threat-detection/mitigate", { id: threatId });
      alert("Threat mitigation initiated successfully!");
      fetchThreatData();
    } catch (err) {
      console.error("Error mitigating threat:", err);
    }
  };

  return (
    <div className="ai-threat-detection-container">
      <Sidebar />
      <Container fluid className="ai-threat-detection-content">
        <h2 className="ai-threat-detection-title">🛡️ AI Threat Detection System</h2>

        {/* Threat Detection Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="threat-table mt-4">
            <thead>
              <tr>
                <th>Threat Type</th>
                <th>Detected At</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {threatData.map((data, index) => (
                <tr key={index}>
                  <td>{data.type}</td>
                  <td>{new Date(data.detectedAt).toLocaleString()}</td>
                  <td>
                    <ProgressBar
                      now={data.riskLevel}
                      label={`${data.riskLevel}%`}
                      variant={data.riskLevel > 70 ? "danger" : data.riskLevel > 40 ? "warning" : "success"}
                    />
                  </td>
                  <td>{data.status}</td>
                  <td>
                    <Button variant="danger" onClick={() => mitigateThreat(data._id)} disabled={data.status === "Resolved"}>
                      Mitigate
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
        .ai-threat-detection-container {
  display: flex;
  height: 100vh;
}

.ai-threat-detection-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-threat-detection-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.threat-table th {
  background-color: #c0392b;
  color: white;
  text-align: center;
}

.threat-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIThreatDetection;
