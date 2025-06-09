import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "../components/Sidebar";

const RevenueBreakdown = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    fetchRevenueBreakdown();
  }, []);

  const fetchRevenueBreakdown = async () => {
    try {
      const response = await axios.get("/api/revenue-breakdown");
      setRevenueData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching revenue breakdown:", error);
      setError("Failed to load revenue breakdown data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = revenueData;
    if (role) {
      filtered = filtered.filter(data => data.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(data => data.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(data => data.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(data => data.periodType === "Yearly");
    }
    setFilteredData(filtered);
  };

  const chartData = {
    labels: ["Commissions", "Bonuses", "Incentives", "Other Earnings"],
  datasets: [
    {
      label: "Revenue Breakdown ($)",
      // data: [totalCommissions, totalBonuses, totalIncentives, totalOtherEarnings],
      backgroundColor: ["#2ecc71", "#f39c12", "#3498db", "#9b59b6"],
    },
  ],
  };

  return (
    <div className="revenue-breakdown-container">
     <Sidebar />
     <div className="revenue-breakdown-main">
      <h2 className="text-primary mb-4">💰 Revenue Breakdown</h2>

      <div className="revenue-breakdown">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Customer Become A Vendor">Customer Become A Vendor</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>
        <Button variant="primary" onClick={handleFilter} className="w-50">Apply Filters</Button>
    
       </div>
      
       

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading revenue data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <div className="chart">
            <h5>Revenue Breakdown</h5>
            <Pie data={chartData} />
          </div>
        </div>
      )}
      <style>
        {`
        /* Revenue Breakdown Styling */
        .revenue-breakdown-container {
        display: flex;
        flex-direction: row;
         width: 100vw;
         height: 100vh;
        }
.revenue-breakdown-main {
   padding: 7% 20px;
   width: 100%;
   height: 100%;
   overflow-y: scroll;
}
   .revenue-breakdown{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    column-gap: 10px;
    margin: 20px; 
    justify-content: space-between;
    align-items: center;
   }
    .chart h5{
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    }
   @media (max-width: 768px) {  
    .revenue-breakdown-main {
      padding: 7rem 10px;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }
  }

`}
      </style>
    </div>
    </div>
  );
};

export default RevenueBreakdown;
