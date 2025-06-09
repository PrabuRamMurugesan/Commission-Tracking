import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Form, Button, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AILeadScoring.css"; // Importing CSS

const AILeadScoring = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    fetchLeadScoring();
  }, []);

  const fetchLeadScoring = async () => {
    try {
      const response = await axios.get(`/api/ai-lead-scoring?minScore=${minScore}`);
      setLeads(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch lead scoring data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-lead-scoring-container">
      <Sidebar />
      <Container fluid className="ai-lead-scoring-content">
        <h2 className="ai-lead-scoring-title">🎯 AI Lead Scoring</h2>

        {/* Filter Section */}
        <Form.Group className="mb-3">
          <Form.Label>Minimum Lead Score</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
          />
          <Button className="mt-2" variant="primary" onClick={fetchLeadScoring}>
            Apply Filter
          </Button>
        </Form.Group>

        {/* Lead Scoring Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="lead-score-table mt-4">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index}>
                  <td>{lead.leadId}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>
                    <Badge bg={lead.score > 75 ? "success" : lead.score > 50 ? "warning" : "danger"}>
                      {lead.score}
                    </Badge>
                  </td>
                  <td>{lead.category}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-lead-scoring-container {
  display: flex;
  height: 100vh;
}

.ai-lead-scoring-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-lead-scoring-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.lead-score-table th {
  background-color: #2c3e50;
  color: white;
  text-align: center;
}

.lead-score-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AILeadScoring;
