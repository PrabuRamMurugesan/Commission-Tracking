import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AutomatedLeadGeneration.css"; // Importing CSS

const AutomatedLeadGeneration = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("/api/automated-leads");
      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch leads.");
      setLoading(false);
    }
  };

  return (
    <div className="automated-lead-generation-container">
      <Sidebar />
      <Container fluid className="automated-lead-generation-content">
        <h2 className="automated-lead-generation-title">🚀 AI-Powered Lead Generation</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="lead-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Score</th>
                <th>Follow-Up</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index}>
                  <td>{lead.leadId}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.source}</td>
                  <td>
                    <Badge bg={lead.score > 80 ? "success" : lead.score > 50 ? "warning" : "danger"}>
                      {lead.score}%
                    </Badge>
                  </td>
                  <td>
                    <Button variant="primary" size="sm">Follow Up</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .automated-lead-generation-container {
  display: flex;
  height: 100vh;
}

.automated-lead-generation-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.automated-lead-generation-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.lead-table th {
  background-color: #3498db;
  color: white;
  text-align: center;
}

.lead-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AutomatedLeadGeneration;
