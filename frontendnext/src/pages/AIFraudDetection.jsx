import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIFraudDetection.css"; // Importing CSS

const AIFraudDetection = () => {
  const [fraudCases, setFraudCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFraudCases();
  }, []);

  const fetchFraudCases = async () => {
    try {
      const response = await axios.get("/api/ai-fraud-detection");
      setFraudCases(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load fraud detection data.");
      setLoading(false);
    }
  };

  const resolveFraudCase = async (caseId) => {
    try {
      await axios.post("/api/ai-fraud-detection/resolve", { id: caseId });
      alert("Fraud case resolution initiated successfully!");
      fetchFraudCases();
    } catch (err) {
      console.error("Error resolving fraud case:", err);
    }
  };

  return (
    <div className="ai-fraud-detection-container">
      <Sidebar />
      <Container fluid className="ai-fraud-detection-content">
        <h2 className="ai-fraud-detection-title">🚨 AI Fraud Detection System</h2>

        {/* Fraud Detection Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="fraud-table mt-4">
            <thead>
              <tr>
                <th>Fraud Type</th>
                <th>Transaction ID</th>
                <th>Detected At</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fraudCases.map((fraud, index) => (
                <tr key={index}>
                  <td>{fraud.type}</td>
                  <td>{fraud.transactionId}</td>
                  <td>{new Date(fraud.detectedAt).toLocaleString()}</td>
                  <td>
                    <ProgressBar
                      now={fraud.riskLevel}
                      label={`${fraud.riskLevel}%`}
                      variant={fraud.riskLevel > 70 ? "danger" : fraud.riskLevel > 40 ? "warning" : "success"}
                    />
                  </td>
                  <td>{fraud.status}</td>
                  <td>
                    <Button variant="danger" onClick={() => resolveFraudCase(fraud._id)} disabled={fraud.status === "Resolved"}>
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
        .ai-fraud-detection-container {
  display: flex;
  height: 100vh;
}

.ai-fraud-detection-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-fraud-detection-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.fraud-table th {
  background-color: #e74c3c;
  color: white;
  text-align: center;
}

.fraud-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIFraudDetection;
