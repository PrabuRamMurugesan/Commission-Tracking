import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Badge, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAuditCompliance = () => {
  const [auditReports, setAuditReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastAuditTime, setLastAuditTime] = useState("");

  useEffect(() => {
    fetchAuditReports();
  }, []);

  const fetchAuditReports = async () => {
    try {
      const response = await axios.get("/api/ai-audit-compliance");
      const data = Array.isArray(response.data) ? response.data : [];
      setAuditReports(data);
      setLastAuditTime(new Date().toLocaleString());
      setLoading(false);
    } catch (err) {
      setError("Failed to load audit compliance reports.");
      setLoading(false);
    }
  };

  const initiateAudit = async () => {
    try {
      await axios.post("/api/ai-audit-compliance/initiate");
      alert("✅ AI Audit & Compliance Check initiated successfully!");
      fetchAuditReports();
    } catch (err) {
      console.error("Error initiating audit:", err);
    }
  };

  const filteredReports = auditReports.filter((report) =>
    report.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return <Badge bg="danger">High</Badge>;
      case "Medium":
        return <Badge bg="warning">Medium</Badge>;
      case "Low":
        return <Badge bg="success">Low</Badge>;
      default:
        return <Badge bg="secondary">{riskLevel}</Badge>;
    }
  };

  const renderStatusBadge = (status) => {
    return status === "Passed" ? (
      <Badge bg="success">Passed</Badge>
    ) : (
      <Badge bg="danger">Failed</Badge>
    );
  };

  return (
    <div className="ai-audit-compliance-container">
      <Sidebar />
      <Container fluid className="ai-audit-compliance-content">
        <h2 className="ai-audit-compliance-title">📊 AI Audit & Compliance</h2>

        <Row className="align-items-center mb-3">
          <Col md={6}>
            <Button variant="primary" onClick={initiateAudit}>
              🚀 Initiate AI Audit & Compliance Check
            </Button>
            <Button variant="secondary" className="ms-2" onClick={fetchAuditReports}>
              Refresh
            </Button>
          </Col>
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search by Compliance Area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        {lastAuditTime && (
          <p className="text-muted">Last Audit Initiated: {lastAuditTime}</p>
        )}

        {/* Audit Compliance Reports Table */}
        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredReports.length === 0 ? (
          <Alert variant="info">No audit reports found. Try initiating a new audit.</Alert>
        ) : (
          <Table striped bordered hover responsive className="audit-table mt-4">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Compliance Area</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={index}>
                  <td>{report.timestamp}</td>
                  <td>{report.area}</td>
                  <td>{renderRiskBadge(report.riskLevel)}</td>
                  <td>{renderStatusBadge(report.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Inline Styling */}
      <style>
        {`
        .ai-audit-compliance-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }
        
        .ai-audit-compliance-content {
       width: 100%;
          overflow-y: scroll;
          padding: 7% 20px;
          background-color: #f8f9fa;
        }
        
        .ai-audit-compliance-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        
        .audit-table th {
          background-color: #2980b9;
          color: white;
          text-align: center;
        }
        
        .audit-table td {
          text-align: center;
          padding: 10px;
        }

        @media (max-width: 768px) {
          .ai-audit-compliance-content {
            padding: 7rem 10px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default AIAuditCompliance;
