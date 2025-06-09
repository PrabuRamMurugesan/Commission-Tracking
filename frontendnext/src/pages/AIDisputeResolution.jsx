import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIDisputeResolution.css"; // Importing CSS

const AIDisputeResolution = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDispute, setNewDispute] = useState({
    user: "",
    transactionId: "",
    reason: "",
  });

  useEffect(() => {
    fetchDisputeCases();
  }, []);

  const fetchDisputeCases = async () => {
    try {
      const response = await axios.get("/api/ai-dispute-resolution");
      setDisputes(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch dispute cases.");
      setLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    try {
      const response = await axios.post("/api/ai-dispute-resolution", newDispute);
      setDisputes([...disputes, response.data]);
      setNewDispute({ user: "", transactionId: "", reason: "" });
    } catch (err) {
      setError("Failed to create dispute.");
    }
  };

  return (
    <div className="ai-dispute-resolution-container">
      <Sidebar />
      <Container fluid className="ai-dispute-resolution-content">
        <h2 className="ai-dispute-resolution-title">⚖️ AI Dispute Resolution</h2>

        {/* Dispute Creation Form */}
        <Card className="dispute-form-card">
          <Card.Body>
            <h5>Submit a Dispute</h5>
            <Form>
              <Form.Group>
                <Form.Label>User</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  value={newDispute.user}
                  onChange={(e) => setNewDispute({ ...newDispute, user: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Transaction ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter transaction ID"
                  value={newDispute.transactionId}
                  onChange={(e) => setNewDispute({ ...newDispute, transactionId: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Reason for Dispute</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter reason for dispute"
                  value={newDispute.reason}
                  onChange={(e) => setNewDispute({ ...newDispute, reason: e.target.value })}
                />
              </Form.Group>
              <Button className="mt-3" variant="primary" onClick={handleCreateDispute}>
                Submit Dispute
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Dispute List */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="dispute-table mt-4">
            <thead>
              <tr>
                <th>Dispute ID</th>
                <th>User</th>
                <th>Transaction ID</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute, index) => (
                <tr key={index}>
                  <td>{dispute.disputeId}</td>
                  <td>{dispute.user}</td>
                  <td>{dispute.transactionId}</td>
                  <td>{dispute.reason}</td>
                  <td>{dispute.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-dispute-resolution-container {
  display: flex;
  height: 100vh;
}

.ai-dispute-resolution-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-dispute-resolution-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.dispute-form-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.dispute-table th {
  background-color: #c0392b;
  color: white;
  text-align: center;
}

.dispute-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIDisputeResolution;
