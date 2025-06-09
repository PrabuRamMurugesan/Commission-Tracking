import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIProductRecommendation.css"; // Importing CSS

const AIProductRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState("");

  useEffect(() => {
    if (customer) {
      fetchRecommendations();
    }
  }, [customer]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`/api/ai-product-recommendations?customer=${customer}`);
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load product recommendations.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-product-recommendation-container">
      <Sidebar />
      <Container fluid className="ai-product-recommendation-content">
        <h2 className="ai-product-recommendation-title">🛍️ AI Product Recommendations</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Customer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter customer email or ID"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </Form.Group>
        </Form>

        {/* Product Recommendation Cards */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>
            {recommendations.map((product, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="product-card">
                  <Card.Img variant="top" src={product.image} alt={product.name} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <h5>${product.price}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <style>
        {`
        .ai-product-recommendation-container {
  display: flex;
  height: 100vh;
}

.ai-product-recommendation-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-product-recommendation-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.product-card {
  transition: 0.3s ease-in-out;
}

.product-card:hover {
  transform: scale(1.05);
}

.product-card img {
  height: 200px;
  object-fit: cover;
}
`}
      </style>
    </div>
  );
};

export default AIProductRecommendation;
