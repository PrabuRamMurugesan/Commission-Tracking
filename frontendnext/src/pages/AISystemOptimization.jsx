import React, { useState } from "react";
import { Container, Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISystemOptimization.css"; // Importing CSS

const AISystemOptimization = () => {
  const [optimizationResults, setOptimizationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startOptimization = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/ai-system-optimization");
      setOptimizationResults(response.data.optimization);
    } catch (err) {
      setError("Failed to optimize system performance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-system-optimization-container">
      <Sidebar />
      <Container fluid className="ai-system-optimization-content">
        <h2 className="ai-system-optimization-title">⚡ AI System Optimization</h2>

        <Card className="optimization-card">
          <Card.Body>
            <Button variant="success" onClick={startOptimization}>
              Start Optimization
            </Button>
            {loading && <Spinner animation="border" className="optimization-spinner" />}
            {error && <Alert variant="danger">{error}</Alert>}
          </Card.Body>
        </Card>

        {optimizationResults.length > 0 && (
          <Table striped bordered hover className="optimization-table mt-4">
            <thead>
              <tr>
                <th>Optimization ID</th>
                <th>Component</th>
                <th>Performance Boost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {optimizationResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.id}</td>
                  <td>{result.component}</td>
                  <td>{result.boost}%</td>
                  <td>{result.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-system-optimization-container {
  display: flex;
  height: 100vh;
}

.ai-system-optimization-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-system-optimization-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.optimization-card {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.optimization-spinner {
  margin-top: 10px;
}

.optimization-table th {
  background-color: #27ae60;
  color: white;
  text-align: center;
}

.optimization-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISystemOptimization;
