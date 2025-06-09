import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIDatabaseOptimizer.css"; // Importing CSS

const AIDatabaseOptimizer = () => {
  const [dbMetrics, setDbMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDatabaseMetrics();
  }, []);

  const fetchDatabaseMetrics = async () => {
    try {
      const response = await axios.get("/api/ai-database-optimizer");
      setDbMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load database optimization metrics.");
      setLoading(false);
    }
  };

  const optimizeDatabase = async () => {
    try {
      await axios.post("/api/ai-database-optimizer/optimize");
      alert("AI Database Optimization initiated successfully!");
      fetchDatabaseMetrics();
    } catch (err) {
      console.error("Error optimizing database:", err);
    }
  };

  return (
    <div className="ai-database-optimizer-container">
      <Sidebar />
      <Container fluid className="ai-database-optimizer-content">
        <h2 className="ai-database-optimizer-title">🛠️ AI Database Optimizer</h2>

        <Button variant="primary" className="mb-3" onClick={optimizeDatabase}>
          Optimize Database
        </Button>

        {/* Database Optimization Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="database-table mt-4">
            <thead>
              <tr>
                <th>Database Table</th>
                <th>Query Load (%)</th>
                <th>Indexing Efficiency (%)</th>
                <th>Optimization Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {dbMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.table}</td>
                  <td>
                    <ProgressBar
                      now={metric.queryLoad}
                      label={`${metric.queryLoad}%`}
                      variant={metric.queryLoad > 80 ? "danger" : metric.queryLoad > 50 ? "warning" : "success"}
                    />
                  </td>
                  <td>
                    <ProgressBar
                      now={metric.indexEfficiency}
                      label={`${metric.indexEfficiency}%`}
                      variant={metric.indexEfficiency > 80 ? "success" : metric.indexEfficiency > 50 ? "warning" : "danger"}
                    />
                  </td>
                  <td>{metric.optimizationSuggestion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-database-optimizer-container {
  display: flex;
  height: 100vh;
}

.ai-database-optimizer-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-database-optimizer-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.database-table th {
  background-color: #27ae60;
  color: white;
  text-align: center;
}

.database-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIDatabaseOptimizer;
