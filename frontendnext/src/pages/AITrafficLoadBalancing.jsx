import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, ProgressBar } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AITrafficLoadBalancing.css"; // Importing CSS

const AITrafficLoadBalancing = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      const response = await axios.get("/api/ai-traffic-load-balancing");
      setTrafficData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load traffic load balancing data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-traffic-load-balancing-container">
      <Sidebar />
      <Container fluid className="ai-traffic-load-balancing-content">
        <h2 className="ai-traffic-load-balancing-title">🌐 AI Traffic Load Balancing</h2>

        {/* Traffic Distribution Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="traffic-table mt-4">
            <thead>
              <tr>
                <th>Server Node</th>
                <th>Current Traffic (%)</th>
                <th>Load Balancing Status</th>
              </tr>
            </thead>
            <tbody>
              {trafficData.map((data, index) => (
                <tr key={index}>
                  <td>{data.serverNode}</td>
                  <td>{data.trafficLoad}%</td>
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
        .ai-traffic-load-balancing-container {
  display: flex;
  height: 100vh;
}

.ai-traffic-load-balancing-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-traffic-load-balancing-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.traffic-table th {
  background-color: #2c3e50;
  color: white;
  text-align: center;
}

.traffic-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AITrafficLoadBalancing;
