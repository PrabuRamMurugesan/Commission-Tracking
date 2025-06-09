import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutoHealingSystem = () => {
  const [healingLogs, setHealingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchHealingLogs();
  }, []);

  const fetchHealingLogs = async () => {
    try {
      const response = await axios.get("/api/auto-healing/logs");
      const data = response.data;
  
      // Ensure it's an array before setting
      setHealingLogs(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load auto-healing logs.");
      setHealingLogs([]); // ensure fallback to empty array
      setLoading(false);
    }
  };
  

  const triggerAutoHeal = async () => {
    try {
      await axios.post("/api/auto-healing/trigger");
      alert("AI Auto-Healing triggered successfully!");
      fetchHealingLogs();
    } catch (err) {
      console.error("Auto-healing trigger failed", err);
    }
  };

  return (
    <div className="ai-auto-healing-container">
      <Sidebar />
      <Container fluid className="ai-auto-healing-content">
        <h2 className="ai-auto-healing-title">🛠️ AI Auto-Healing System</h2>

        <Button variant="success" className="mb-3" onClick={triggerAutoHeal}>
          Trigger AI Auto-Healing
        </Button>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="healing-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Issue Detected</th>
                <th>Resolution Applied</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {healingLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.timestamp}</td>
                  <td>{log.issue}</td>
                  <td>{log.resolution}</td>
                  <td>
                    <Badge bg={log.status === "Resolved" ? "success" : "warning"}>
                      {log.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetails(true);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📄 Healing Log Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog ? (
            <div>
              <p><strong>Timestamp:</strong> {selectedLog.timestamp}</p>
              <p><strong>Issue:</strong> {selectedLog.issue}</p>
              <p><strong>Resolution:</strong> {selectedLog.resolution}</p>
              <p><strong>Status:</strong> {selectedLog.status}</p>
              <p><strong>Details:</strong> {selectedLog.details || "N/A"}</p>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
  .ai-auto-healing-container {
    display: flex;
    flex-direction: row;
   
    width: 100vw;
    height: 100vh;
  }

  .ai-auto-healing-content {
   
    padding: 7% 20px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }

  .ai-auto-healing-title {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .healing-table {
    min-width: 600px; /* Ensures horizontal scroll on small devices */
  }

  .healing-table th {
    background-color: #16a085;
    color: white;
    text-align: center;
  }

  .healing-table td {
    text-align: center;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    .ai-auto-healing-title {
      font-size: 20px;
      text-align: center;
    }

    .ai-auto-healing-content {
      padding: 7rem 10px;
    }

    .healing-table {
      font-size: 14px;
    }
  }
`}</style>

    </div>
  );
};

export default AIAutoHealingSystem;
