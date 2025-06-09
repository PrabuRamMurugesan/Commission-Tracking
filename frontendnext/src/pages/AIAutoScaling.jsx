import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutoScaling = () => {
  const [scalingMetrics, setScalingMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScalingMetrics();
  }, []);

  const fetchScalingMetrics = async () => {
    try {
      const response = await axios.get("/api/ai-auto-scaling");

      console.log("API Response:", response.data); // Debug log

      const data = response.data;

      // Ensure data is an array
      setScalingMetrics(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load auto-scaling metrics.");
      setLoading(false);
    }
  };

  const triggerAutoScaling = async () => {
    try {
      await axios.post("/api/ai-auto-scaling/trigger");
      alert("Auto Scaling initiated successfully!");
      fetchScalingMetrics();
    } catch (err) {
      console.error("Error triggering auto scaling:", err);
    }
  };

  return (
    <div className="ai-auto-scaling-container">
      <Sidebar />
      <Container fluid className="ai-auto-scaling-content">
        <h2 className="ai-auto-scaling-title">⚙️ AI Auto Scaling System</h2>

        <Button variant="primary" className="mb-3" onClick={triggerAutoScaling}>
          Trigger Auto Scaling
        </Button>

        {/* Auto Scaling Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : scalingMetrics.length === 0 ? (
          <Alert variant="info">No scaling metrics available.</Alert>
        ) : (
          <Table striped bordered hover responsive className="scaling-table mt-4">
            <thead>
              <tr>
                <th>Server Instance</th>
                <th>CPU Usage (%)</th>
                <th>Memory Usage (%)</th>
                <th>Scaling Action</th>
              </tr>
            </thead>
            <tbody>
              {scalingMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.instance}</td>
                  <td>
                    <ProgressBar
                      now={metric.cpuUsage}
                      label={`${metric.cpuUsage}%`}
                      variant={
                        metric.cpuUsage > 80
                          ? "danger"
                          : metric.cpuUsage > 50
                          ? "warning"
                          : "success"
                      }
                    />
                  </td>
                  <td>
                    <ProgressBar
                      now={metric.memoryUsage}
                      label={`${metric.memoryUsage}%`}
                      variant={
                        metric.memoryUsage > 80
                          ? "danger"
                          : metric.memoryUsage > 50
                          ? "warning"
                          : "success"
                      }
                    />
                  </td>
                  <td>{metric.scalingAction}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-auto-scaling-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .ai-auto-scaling-content {
          flex-grow: 1;
          padding: 7% 20px;
          background-color: #f8f9fa;
        }

        .ai-auto-scaling-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .scaling-table th {
          background-color: #3498db;
          color: white;
          text-align: center;
        }

        .scaling-table td {
          text-align: center;
          padding: 10px;
        }

        @media (max-width: 768px) {
          .ai-auto-scaling-content {
            padding: 7rem 20px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default AIAutoScaling;
