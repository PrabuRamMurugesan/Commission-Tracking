import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, ProgressBar } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIScalabilityEnhancements.css"; // Importing CSS

const AIScalabilityEnhancements = () => {
  const [scalabilityData, setScalabilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScalabilityData();
  }, []);

  const fetchScalabilityData = async () => {
    try {
      const response = await axios.get("/api/ai-scalability-enhancements");
      setScalabilityData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load scalability data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-scalability-enhancements-container">
      <Sidebar />
      <Container fluid className="ai-scalability-enhancements-content">
        <h2 className="ai-scalability-enhancements-title">📈 AI Scalability Enhancements</h2>

        {/* Scalability Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="scalability-table mt-4">
            <thead>
              <tr>
                <th>Server Node</th>
                <th>Current Load (%)</th>
                <th>Optimization Status</th>
              </tr>
            </thead>
            <tbody>
              {scalabilityData.map((data, index) => (
                <tr key={index}>
                  <td>{data.serverNode}</td>
                  <td>{data.currentLoad}%</td>
                  <td>
                    <ProgressBar
                      now={data.optimizationScore}
                      label={`${data.optimizationScore}%`}
                      variant={data.optimizationScore > 80 ? "success" : data.optimizationScore > 50 ? "warning" : "danger"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-scalability-enhancements-container {
  display: flex;
  height: 100vh;
}

.ai-scalability-enhancements-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-scalability-enhancements-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.scalability-table th {
  background-color: #8e44ad;
  color: white;
  text-align: center;
}

.scalability-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIScalabilityEnhancements;
