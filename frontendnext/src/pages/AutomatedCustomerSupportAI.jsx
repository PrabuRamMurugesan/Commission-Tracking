import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AutomatedCustomerSupportAI.css"; // Importing CSS

const AutomatedCustomerSupportAI = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuerySubmit = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/automated-customer-support", { query });
      setResponse(res.data.answer);
      setError("");
    } catch (err) {
      setError("Failed to get a response. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="automated-support-container">
      <Sidebar />
      <Container fluid className="automated-support-content">
        <h2 className="automated-support-title">🤖 AI-Powered Customer Support</h2>

        <Card className="support-card">
          <Card.Body>
            <Form.Group>
              <Form.Label>Ask a Question</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your question here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-3" variant="primary" onClick={handleQuerySubmit}>
              Ask AI
            </Button>
          </Card.Body>
        </Card>

        {loading && <Spinner animation="border" className="mt-3" />}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {response && (
          <Card className="response-card mt-3">
            <Card.Body>
              <h5>AI Response:</h5>
              <p>{response}</p>
            </Card.Body>
          </Card>
        )}
      </Container>
      <style>
        {`
        .automated-support-container {
  display: flex;
  height: 100vh;
}

.automated-support-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.automated-support-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.support-card, .response-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
`}
      </style>
    </div>
  );
};

export default AutomatedCustomerSupportAI;
