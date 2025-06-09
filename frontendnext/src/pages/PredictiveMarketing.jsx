import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Table, Badge, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const PredictiveMarketing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); // Corrected to boolean
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPredictiveMarketingData();
  }, []);


  const fetchPredictiveMarketingData = async () => {
    try {
      // 🔁 MOCKED DATA
      const mockData = [
        {
          name: "Gold Festive Blast",
          targetAudience: "Young Adults",
          engagementRate: 72,
          conversionRate: 38,
          status: "Active",
        },
        {
          name: "Wedding Collection Promo",
          targetAudience: "Newlyweds",
          engagementRate: 85,
          conversionRate: 48,
          status: "Active",
        },
        {
          name: "Summer Shine Sale",
          targetAudience: "Working Professionals",
          engagementRate: 63,
          conversionRate: 22,
          status: "Inactive",
        },
        {
          name: "Referral Bonus Campaign",
          targetAudience: "Referral Users",
          engagementRate: 50,
          conversionRate: 18,
          status: "Active",
        },
      ];
  
      setCampaigns(mockData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch predictive marketing data.");
      setLoading(false);
    }
  };
  
  return (
    <div className="predictive-marketing-container">
      <Sidebar />
      <Container fluid className="predictive-marketing-content">
        <h2 className="predictive-marketing-title">📊 Predictive Marketing</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Table striped bordered hover responsive className="marketing-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target Audience</th>
                <th>Engagement Rate</th>
                <th>Conversion Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(campaigns) && campaigns.map((campaign, index) => (
                <tr key={index}>
                  <td>{campaign.name}</td>
                  <td>{campaign.targetAudience}</td>
                  <td>{campaign.engagementRate}%</td>
                  <td>{campaign.conversionRate}%</td>
                  <td>
                    <Badge bg={campaign.status === "Active" ? "success" : "danger"}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="info" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <style>
        {`
        .predictive-marketing-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .predictive-marketing-content {
          flex-grow: 1;
          padding: 6% 20px;
          background-color: #f8f9fa;
        }

        .predictive-marketing-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .marketing-table th {
          background-color: lightgreen;
          color: black;
          text-align: center;
        }

        .marketing-table td {
          text-align: center;
          padding: 10px;
        }

        @media (max-width: 768px) {
          .predictive-marketing-content {
            padding: 8rem 10px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default PredictiveMarketing;
