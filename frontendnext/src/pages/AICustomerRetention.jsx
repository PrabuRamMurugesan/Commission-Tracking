import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Form, Button, Badge } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Line } from "react-chartjs-2";

const AICustomerRetention = () => {
  const [retentionData, setRetentionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchRetentionData();
  }, [timeframe]);

  const fetchRetentionData = async () => {
    try {
      const response = await axios.get(`/api/ai-customer-retention?timeframe=${timeframe}`);
      setRetentionData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch customer retention data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: retentionData.map((data) => data.date),
    datasets: [
      {
        label: "Customer Retention Rate (%)",
        data: retentionData.map((data) => data.retentionRate),
        backgroundColor: "#1abc9c",
        borderColor: "#16a085",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="ai-customer-retention-container">
      <Sidebar />
      <Container fluid className="ai-customer-retention-content">
        <h2 className="ai-customer-retention-title">📊 AI Customer Retention</h2>

        {/* Filter Section */}
        <Form.Group className="mb-3">
          <Form.Label>Select Timeframe</Form.Label>
          <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </Form.Control>
          <Button className="mt-2" variant="primary" onClick={fetchRetentionData}>
            Apply Filter
          </Button>
        </Form.Group>

        {/* Customer Retention Chart */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            <Row>
              <Col md={12}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Customer Retention Trend</h5>
                    <Line data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Retention Data Table */}
            <Table striped bordered hover responsive className="retention-table mt-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Retention Rate (%)</th>
                  <th>Customer Segment</th>
                </tr>
              </thead>
              <tbody>
                {retentionData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.date}</td>
                    <td>
                      <Badge bg={data.retentionRate > 75 ? "success" : data.retentionRate > 50 ? "warning" : "danger"}>
                        {data.retentionRate}%
                      </Badge>
                    </td>
                    <td>{data.customerSegment}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-customer-retention-container {
  display: flex;
  height: 100vh;
}

.ai-customer-retention-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-customer-retention-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.retention-table th {
  background-color: #3498db;
  color: white;
  text-align: center;
}

.retention-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AICustomerRetention;
