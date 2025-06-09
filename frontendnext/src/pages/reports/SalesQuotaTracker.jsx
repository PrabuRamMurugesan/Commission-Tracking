//Agent & Franchise Sales Tracking

import React, { useEffect, useState } from "react";
import { Card, ProgressBar, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const SalesQuotaTracker = () => {
  const [quotaData, setQuotaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuotaData();
  }, []);

  const fetchQuotaData = async () => {
    try {
      const response = await axios.get("/api/sales-quota/tracker");
      setQuotaData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales quota:", error);
      setError("Failed to load sales quota data.");
      setLoading(false);
    }
  };

  return (
    <div className="sales-quota-tracker">
      <h2 className="text-primary mb-4">📊 Sales Quota Progress</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading quota data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        quotaData.map((quota, index) => (
          <Card className="quota-card mb-3" key={index}>
            <Card.Body>
              <Card.Title>{quota.agentName} - Target: ${quota.target}</Card.Title>
              <ProgressBar
                now={(quota.sales / quota.target) * 100}
                label={`${((quota.sales / quota.target) * 100).toFixed(1)}%`}
                variant={quota.sales >= quota.target ? "success" : "warning"}
              />
            </Card.Body>
          </Card>
        ))
      )}
      <style>
        {`
        .sales-quota-tracker {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.quota-card {
  padding: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
`}
      </style>
    </div>
  );
};

export default SalesQuotaTracker;
