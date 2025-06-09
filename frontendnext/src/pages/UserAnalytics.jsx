import React, { useEffect, useState } from "react";
import { Spinner, Alert, Form, Button } from "react-bootstrap";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios"; // Optional, if real API used
import Sidebar from "../components/Sidebar";

const UserAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [timeframe, setTimeframe] = useState("Monthly");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Simulating API call with mock data
      const data = [
        { month: "Jan", totalCommission: 50000, userType: "Franchise", region: "South" },
        { month: "Feb", totalCommission: 60000, userType: "Agent", region: "North" },
        { month: "Mar", totalCommission: 80000, userType: "Vendor", region: "East" },
        { month: "Apr", totalCommission: 70000, userType: "Franchise", region: "West" },
      ];
      setAnalyticsData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load analytics data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    // Filtering logic if needed
  };

  // Prepare data for charts
  const commissionGrowthData = {
    labels: analyticsData.map(item => item.month),
    datasets: [{
      label: "Total Commissions (₹)",
      data: analyticsData.map(item => item.totalCommission),
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.2)",
      fill: true
    }]
  };

  const userTypeCommissionData = {
    labels: [...new Set(analyticsData.map(item => item.userType))],
    datasets: [{
      label: "Commission by User Type",
      data: [...new Set(analyticsData.map(item => item.totalCommission))],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"]
    }]
  };

  const regionDistributionData = {
    labels: [...new Set(analyticsData.map(item => item.region))],
    datasets: [{
      label: "User Distribution",
      data: [...new Set(analyticsData.map(item => item.totalCommission))],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"]
    }]
  };

  return (
  <div className="UserAnalytics-page">
    <Sidebar/>
    <div className="user-analytics-container">
      <h2 className="text-primary mb-4">📊 User Analytics</h2>

      {/* Filters */}
      <div className="filters mb-4 d-flex gap-3">
        <Form.Select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">All User Types</option>
          <option value="Franchise">Franchise</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Select>

        <Form.Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Select>

        <Button variant="primary" onClick={handleFilter}>
          Apply Filters
        </Button>
      </div>

      {/* Loading, Error, and Charts */}
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts d-flex flex-wrap gap-4">
          <div className="chart-container p-3 shadow rounded bg-white">
            <h5>📈 Commission Growth</h5>
            <Line data={commissionGrowthData} />
          </div>

          <div className="chart-container p-3 shadow rounded bg-white">
            <h5>📊 User Type Wise Commission</h5>
            <Bar data={userTypeCommissionData} />
          </div>

          <div className="chart-container p-3 shadow rounded bg-white">
            <h5>🗺️ Region Wise Distribution</h5>
            <Pie data={regionDistributionData} />
          </div>
        </div>
      )}

      {/* Inline CSS */}
      <style>
        {`
          .UserAnalytics-page {
            display: flex;
            width: 100vw;
            height: 100vh;
          }

          .user-analytics-container {   
          width: 100%;
          height: 100%;
          padding: 7%  40px;
          overflow-y: scroll;
          }
          .charts {
  display: flex;
  justify-content: center; // Center the charts horizontally
  align-items: flex-start; // Align charts to top (you can change to center if you want perfect vertical centering)
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 400px;
  width: 100%;
  text-align: center; // Center the text (like titles) inside each card
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  canvas {
    margin-top: 20px;
    width: 100% !important;
    height: auto !important;
  }
}

/* Optional: Make Pie Chart even smaller and centered nicely */
.chart-container:nth-child(3) canvas {
  width: 250px !important;
  height: 250px !important;
}
 @media (max-width: 768px) {
  .chart-container {
    width: 100%;
  }
    .user-analytics-container {
      padding: 7rem 20px;
    }
}   
        `}
      </style>
    </div>
  </div>
  );
};

export default UserAnalytics;
