import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const SalesLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchSalesLeaderboard();
  }, []);

  const fetchSalesLeaderboard = async () => {
    try {
      const response = await axios.get("/api/sales-leaderboard");
      setLeaderboard(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = leaderboard;
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(user => user.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(user => user.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(user => user.periodType === "Yearly");
    }
    setFilteredData(filtered);
  };

  return (
    <div className="sales-leaderboard-page">
      <Sidebar/>
      <div className="sales-leaderboard-container">
      <h2 className="text-primary mb-4">🏆 Sales Leaderboard</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Customer Became a Vendor">Customer Became a Vendor</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>
        
        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>
        
        <Button className="w-50" variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading leaderboard...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Role</th>
              <th>Total Sales ($)</th>
              <th>Total Earnings ($)</th>
            </tr>
          </thead>
          <tbody>
            {/* {filteredData.map((user, index) => (
              <tr key={index}>
                <td>#{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>${user.totalSales}</td>
                <td>${user.totalEarnings}</td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      <style>
        {`
      .sales-leaderboard-page{
      display: flex;
      width: 100vw;
      height: 100vh;
        }

      .sales-leaderboard-container{
      padding: 7% 20px;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      }
      .filters{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      column-gap: 10px;
      }
      @media (max-width: 1020px) {
      .sales-leaderboard-container{
      padding: 7rem 10px;
      }
`}
      </style>
    </div>
    </div>
  );
};

export default SalesLeaderboard;
