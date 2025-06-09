import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  ProgressBar,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutoScalingSecurity = () => {
  const [securityData, setSecurityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const response = await axios.get("/api/ai-auto-scaling-security");
      console.log("Fetched Security Data:", response.data);

      // Ensure response is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setSecurityData(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load security scaling data.");
      setLoading(false);
    }
  };

  const triggerSecurityUpgrade = async () => {
    try {
      await axios.post("/api/ai-auto-scaling-security/upgrade");
      alert("Security Scaling Triggered Successfully!");
      fetchSecurityData();
    } catch (err) {
      console.error("Error triggering security upgrade:", err);
    }
  };

  return (
    <div className="ai-auto-scaling-security-container">
      <Sidebar />
      <Container fluid className="ai-auto-scaling-security-content">
        <h2 className="ai-auto-scaling-security-title">🔒 AI Auto Scaling Security</h2>

        <Button variant="danger" className="mb-3" onClick={triggerSecurityUpgrade}>
          Trigger Security Upgrade
        </Button>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : Array.isArray(securityData) && securityData.length > 0 ? (
          <Table striped bordered hover responsive className="security-table mt-4">
            <thead>
              <tr>
                <th>System Component</th>
                <th>Threat Level</th>
                <th>Scaling Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {securityData.map((data, index) => (
                <tr key={index}>
                  <td>{data.component}</td>
                  <td>
                    <ProgressBar
                      now={data.threatLevel}
                      label={`${data.threatLevel}%`}
                      variant={
                        data.threatLevel > 70
                          ? "danger"
                          : data.threatLevel > 40
                          ? "warning"
                          : "success"
                      }
                    />
                  </td>
                  <td>{data.scalingAction}</td>
                  <td>{data.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">No security data available.</Alert>
        )}
      </Container>

      {/* Styles */}
      <style>
        {`
        .ai-auto-scaling-security-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .ai-auto-scaling-security-content {
          flex-grow: 1;
          padding: 7% 20px;
          background-color: #f8f9fa;
        }

        .ai-auto-scaling-security-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
       

        .security-table th {
          background-color: #e74c3c;
          color: white;
          text-align: center;
          
        }

        .security-table td {
          text-align: center;
          padding: 10px;
        }
          @media (max-width: 768px) {
            .ai-auto-scaling-security-content {
              padding:7rem 20px;
            }
          }
      `}
      </style>
    </div>
  );
};

export default AIAutoScalingSecurity;
