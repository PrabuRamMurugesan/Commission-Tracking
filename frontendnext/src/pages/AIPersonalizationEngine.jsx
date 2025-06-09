import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button, Card } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIPersonalizationEngine.css"; // Importing CSS

const AIPersonalizationEngine = () => {
  const [personalizedData, setPersonalizedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPersonalizedRecommendations();
  }, []);

  const fetchPersonalizedRecommendations = async () => {
    try {
      const response = await axios.get("/api/ai-personalization");
      setPersonalizedData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load personalized recommendations.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-personalization-engine-container">
      <Sidebar />
      <Container fluid className="ai-personalization-engine-content">
        <h2 className="ai-personalization-engine-title">🎯 AI Personalization Engine</h2>

        {/* Personalized Recommendations Section */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="recommendations-grid">
            {personalizedData.map((item, index) => (
              <Card key={index} className="recommendation-card">
                <Card.Body>
                  <Card.Title>{item.productName}</Card.Title>
                  <Card.Text>{item.recommendationReason}</Card.Text>
                  <Button variant="primary">View Product</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
      <style>
        {`
        .ai-personalization-engine-container {
  display: flex;
  height: 100vh;
}

.ai-personalization-engine-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-personalization-engine-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.recommendations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.recommendation-card {
  width: 250px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
`}
      </style>
    </div>
  );
};

export default AIPersonalizationEngine;
