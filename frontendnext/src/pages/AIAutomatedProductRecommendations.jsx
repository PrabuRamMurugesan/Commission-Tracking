import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutomatedProductRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get("/api/ai-product-recommendations");
      const data = response.data;

      // Ensure it's always an array
      if (Array.isArray(data)) {
        setRecommendations(data);
      } else if (data && typeof data === "object") {
        setRecommendations([data]);
      } else {
        setRecommendations([]);
        setError("Invalid data format received.");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load product recommendations.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-product-recommendations-container">
      <Sidebar />
      <Container fluid className="ai-product-recommendations-content">
        <h2 className="ai-product-recommendations-title">
          🛍️ AI Product Recommendations
        </h2> 
        <p className="subtitle">Recommended for you based on recent activity</p>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>
            {recommendations.map((product, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="product-card h-100">
                  <Card.Img
                    variant="top"
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name || "Unnamed Product"}
                  />
                  <Card.Body>
                    <Card.Title>{product.name || "Unnamed Product"}</Card.Title>
                    <Card.Text>
                      Price: ${product.price ? product.price.toFixed(2) : "N/A"}
                    </Card.Text>
                    <div className="d-grid gap-2">
                      <Button variant="primary">Buy Now</Button>
                      <Button variant="outline-secondary">Add to Wishlist</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <style>
        {`
        .ai-product-recommendations-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }
          .ai-product-recommendations-content {
          padding: 8% 20px;
          width:100%;
          height:100%;
          }

        @media (min-width: 768px) {
          .ai-product-recommendations-container {
            flex-direction: row;
          }
        }

        .ai-product-recommendations-content {
   
          padding: 7rem 20px;
          background-color: #f8f9fa;
          overflow-y: auto;
        }

        .ai-product-recommendations-title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          font-size: 16px;
          color: #666;
          margin-bottom: 30px;
        }

        .product-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-card img {
          height: 220px;
          object-fit: cover;
          width: 100%;
        }

        .product-card .card-body {
          text-align: center;
        }

        .product-card .card-title {
          font-size: 18px;
          font-weight: 600;
        }

        .product-card .card-text {
          font-size: 16px;
          color: #555;
        }

        @media (max-width: 767px) {
          .product-card img {
            height: 160px;
          }

          .product-card .card-title {
            font-size: 16px;
          }

          .product-card .card-text {
            font-size: 14px;
          }

          .ai-product-recommendations-title {
            font-size: 22px;
          }

          .subtitle {
            font-size: 14px;
          }
        }
      `}
      </style>
    </div>
  );
};

export default AIAutomatedProductRecommendations;
