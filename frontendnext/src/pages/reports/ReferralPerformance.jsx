import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const ReferralPerformance = () => {
  const [referralData, setReferralData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReferralPerformance();
  }, []);

  const fetchReferralPerformance = async () => {
    try {
      const response = await axios.get("/api/performance/referrals");
      setReferralData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setError("Failed to load referral data.");
      setLoading(false);
    }
  };

  return (
    <div className="performance-container">
      <h2 className="text-primary mb-4">🔗 Referral Performance</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading referral data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="performance-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Referrer</th>
                  <th>Total Referred Sales ($)</th>
                  <th>Commission Earned ($)</th>
                  <th>Successful Referrals</th>
                </tr>
              </thead>
              <tbody>
                {referralData.map((referral, index) => (
                  <tr key={index}>
                    <td>{referral.referrer}</td>
                    <td>${referral.sales}</td>
                    <td>${referral.commission}</td>
                    <td>{referral.successfulReferrals}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <style>
        {`
        .performance-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.performance-card {
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 10px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

h2.text-primary {
  text-align: center;
}
`}
      </style>
    </div>
  );
};

export default ReferralPerformance;
