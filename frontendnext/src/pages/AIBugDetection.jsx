import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIBugDetection = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchBugReports();
  }, []);

  const fetchBugReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/ai-bug-detection");
      console.log("API response:", response.data); // 👈 Add this
  
      // Ensure it's an array
      if (Array.isArray(response.data)) {
        setBugs(response.data);
      } else if (Array.isArray(response.data.bugs)) {
        setBugs(response.data.bugs); // In case it's wrapped inside an object
      } else {
        setBugs([]);
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to load bug reports.");
    } finally {
      setLoading(false);
    }
  };
  

  // 🧠 Filter by status
  const filteredBugs = bugs.filter((bug) =>
    filterStatus === "All" ? true : bug.status === filterStatus
  );

  return (
    <div className="ai-bug-detection-container">
      <Sidebar />
      <Container fluid className="ai-bug-detection-content">
        <h2 className="ai-bug-detection-title">AI Bug Detection</h2>

        {/* Filter and Refresh */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: "200px" }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </Form.Select>
          <Button variant="secondary" onClick={fetchBugReports}>
            🔄 Refresh
          </Button>
        </div>

        {/* Bug Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="bug-table mt-2">
            <thead>
              <tr>
                <th>Bug ID</th>
                <th>Module</th>
                <th>Issue Type</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBugs.map((bug, index) => (
                <tr key={index}>
                  <td>{bug.bugId}</td>
                  <td>{bug.module}</td>
                  <td>{bug.issueType}</td>
                  <td style={{ fontWeight: "bold", color: getSeverityColor(bug.severity) }}>
                    {bug.severity}
                  </td>
                  <td>
                    <Button
                      variant={bug.status === "Resolved" ? "success" : "warning"}
                      disabled
                    >
                      {bug.status}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Styling */}
      <style>
        {`
        .ai-bug-detection-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .ai-bug-detection-content {
          padding: 7% 20px;
        }

        .ai-bug-detection-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .bug-table th {
          background-color: #c0392b;
          color: white;
          text-align: center;
        }

        .bug-table td {
          text-align: center;
          padding: 10px;
        }
          @media (max-width: 768px) {
            .ai-bug-detection-container {
              flex-direction: column;
            }
            .ai-bug-detection-content {
              padding: 7rem 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

// 🎨 Helper to color severity
const getSeverityColor = (severity) => {
  switch (severity) {
    case "High":
      return "red";
    case "Medium":
      return "orange";
    case "Low":
      return "green";
    default:
      return "gray";
  }
};

export default AIBugDetection;
