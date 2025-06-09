import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const FranchisePerformance = () => {
  const [franchiseData, setFranchiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFranchisePerformance();
  }, []);

  const fetchFranchisePerformance = async () => {
    try {
      const response = await axios.get("/api/performance/franchises");
      setFranchiseData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching franchise performance:", error);
      setError("Failed to load franchise data.");
      setLoading(false);
    }
  };

  return (
    <div className="performance-container">
      <h2 className="text-primary mb-4">🏢 Franchise Performance</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading franchise data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="performance-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Franchise Name</th>
                  <th>Total Sales ($)</th>
                  <th>Commission Earned ($)</th>
                  <th>Growth (%)</th>
                </tr>
              </thead>
              <tbody>
                {franchiseData.map((franchise, index) => (
                  <tr key={index}>
                    <td>{franchise.name}</td>
                    <td>${franchise.sales}</td>
                    <td>${franchise.commission}</td>
                    <td>{franchise.growth}%</td>
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

export default FranchisePerformance;
