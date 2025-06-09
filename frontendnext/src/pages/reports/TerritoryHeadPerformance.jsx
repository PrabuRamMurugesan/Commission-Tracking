import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const TerritoryHeadPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const response = await axios.get("/api/performance/territory-head");
      setPerformanceData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      setError("Failed to load performance data.");
      setLoading(false);
    }
  };

  return (
    <div className="performance-container">
      <h2 className="text-primary mb-4">🏆 Territory Head Performance</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading performance data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="performance-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Territory</th>
                  <th>Total Sales ($)</th>
                  <th>Commission Earned ($)</th>
                  <th>Conversion Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.territory}</td>
                    <td>${data.sales}</td>
                    <td>${data.commission}</td>
                    <td>{data.conversionRate}%</td>
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
}

        `}
      </style>
    </div>
  );
};

export default TerritoryHeadPerformance;
