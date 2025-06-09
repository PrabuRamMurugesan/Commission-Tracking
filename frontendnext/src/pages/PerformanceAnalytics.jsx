import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "../components/Sidebar";

const PerformanceAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchPerformanceAnalytics = async () => {
      try {
        const response = await axios.get("/api/performance-analytics");
        setAnalyticsData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching performance analytics:", error);
        setError("Failed to load performance analytics.");
        setLoading(false);
      }
    };

    fetchPerformanceAnalytics();
  }, []);

  const handleFilter = () => {
    let filtered = analyticsData;

    if (role) {
      filtered = filtered.filter((data) => data.role === role);
    }

    if (timeframe) {
      filtered = filtered.filter((data) => data.periodType === timeframe);
    }

    setFilteredData(filtered);
  };

  const chartData = {
 
      labels: Array.isArray(filteredData) ? filteredData.map(data => data.date || "Unknown") : [],
      datasets: [
        {
          label: "Performance Score",
          data: Array.isArray(filteredData) ? filteredData.map(data => data.performanceScore || 0) : [],
          backgroundColor: "#3498db",
          borderColor: "#2980b9",
          borderWidth: 1,
          fill: false,
        },
      ],
    }
 
    
    

  return (
   <div className="performance-analytics-container">
     <Sidebar/>
    <div className="performance-analytics-main">
      <h2 className="text-primary mb-4">📊 Performance Analytics</h2>

      <div className="filters">
        <Form.Control
          as="select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="CustomerBecameAVendor">Customer A Became A Vendor</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control
          as="select"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>
          Apply Filters
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading analytics data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <div className="chart">
            <h5>Performance Over Time</h5>
            <Line data={chartData} className="chart-performance-line"/>
          </div>
        </div>
      )}

      <style>
        {`
        .performance-analytics-container {
         width: 100vw;
         height: 100vh;
         display: flex;
        }
        .performance-analytics-main {
        padding: 7% 20px;
        overflow-y: scroll;
         width: 100%;
         height: 100%;
        }
      
     
        .filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        row-gap: 10px;
        flex-wrap: wrap;
        padding: 10px;
        }
        @media (max-width: 768px) {
        .filters {
        flex-direction: column;
        }
        .performance-analytics-main {
        flex: 1;
        padding: 7rem 20px;
        overflow-y: scroll;
        }
        `}
      </style>
    </div>
   </div>
  );
};

export default PerformanceAnalytics;
