import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const VendorPerformance = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendorPerformance();
  }, []);

  const fetchVendorPerformance = async () => {
    try {
      const response = await axios.get("/api/performance/vendors");
      setVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor performance:", error);
      setError("Failed to load vendor performance data.");
      setLoading(false);
    }
  };

  return (
    <div className="performance-container">
      <h2 className="text-primary mb-4">🛍️ Vendor Performance</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading vendor performance...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="performance-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Sales ($)</th>
                  <th>Commission Earned ($)</th>
                  <th>Top Product</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr key={index}>
                    <td>{vendor.name}</td>
                    <td>${vendor.sales}</td>
                    <td>${vendor.commission}</td>
                    <td>{vendor.topProduct}</td>
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

export default VendorPerformance;
