import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Bar } from "react-chartjs-2";
import "../styles/Dashboard.css"; // Importing CSS

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/dashboard");
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch dashboard data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Sales", "Payouts", "Commissions", "Vendors", "Customers"],
    datasets: [
      {
        label: "Business Overview",
        data: dashboardData
          ? [
              dashboardData.totalSales,
              dashboardData.totalPayouts,
              dashboardData.totalCommissions,
              dashboardData.totalVendors,
              dashboardData.totalCustomers,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: [
          "#3498db",
          "#e74c3c",
          "#f1c40f",
          "#2ecc71",
          "#9b59b6",
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Container fluid className="dashboard-content">
        <h2 className="dashboard-title">📊 Business Dashboard</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            {/* Summary Cards */}
            <Row>
              <Col md={3}>
                <Card className="summary-card">
                  <Card.Body>
                    <h5>Total Sales</h5>
                    <h3>${dashboardData.totalSales}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="summary-card">
                  <Card.Body>
                    <h5>Total Payouts</h5>
                    <h3>${dashboardData.totalPayouts}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="summary-card">
                  <Card.Body>
                    <h5>Total Commissions</h5>
                    <h3>${dashboardData.totalCommissions}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="summary-card">
                  <Card.Body>
                    <h5>Vendors</h5>
                    <h3>{dashboardData.totalVendors}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Chart */}
            <Row>
              <Col md={8}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Business Performance</h5>
                    <Bar data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mt-4">
              <Col md={3}>
                <Button variant="primary" className="dashboard-btn">
                  Manage Vendors
                </Button>
              </Col>
              <Col md={3}>
                <Button variant="success" className="dashboard-btn">
                  View Transactions
                </Button>
              </Col>
              <Col md={3}>
                <Button variant="warning" className="dashboard-btn">
                  Check Payouts
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <style>
        {`
        .dashboard-container {
  display: flex;
  height: 100vh;
}

.dashboard-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.summary-card {
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-btn {
  width: 100%;
  padding: 10px;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}
`}
      </style>
    </div>
  );
};

export default Dashboard;
