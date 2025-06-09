import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const RevenueTracking = () => {
  const [revenues, setRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get("/api/revenue-tracking");
      const validData = Array.isArray(response.data) ? response.data : [];
      setRevenues(validData);
      setFilteredRevenues(validData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError("Failed to load revenue data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = revenues;
    if (role) {
      filtered = filtered.filter((revenue) => revenue.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter((revenue) => revenue.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter((revenue) => revenue.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter((revenue) => revenue.periodType === "Yearly");
    }
    setFilteredRevenues(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Tracking Report", 20, 10);
    doc.autoTable({
      head: [["Date", "User", "Role", "Revenue ($)"]],
      body: (Array.isArray(filteredRevenues) ? filteredRevenues : []).map((revenue) => [
        revenue?.date || "-",
        revenue?.name || "-",
        revenue?.role || "-",
        revenue?.revenueAmount || "0",
      ]),
    });
    doc.save("revenue-tracking.pdf");
  };

  const chartData = {
    labels: (Array.isArray(filteredRevenues) ? filteredRevenues : []).map((revenue) => revenue?.date || ""),
    datasets: [
      {
        label: "Revenue ($)",
        data: (Array.isArray(filteredRevenues) ? filteredRevenues : []).map((revenue) => revenue?.revenueAmount || 0),
        backgroundColor: "#27ae60",
        borderColor: "#1e8449",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="revenue-tracking-page">
      <Sidebar />
      <div className="revenue-tracking-main">
      <h2 className="text-primary mb-4">💰 Revenue Tracking</h2>

      <div className="filters mb-3">
        <Form.Select className="mb-2" onChange={(e) => setRole(e.target.value)} aria-label="Select Role">
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Customer Became A Vendor">Customer Became A Vendor</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Select>

        <Form.Select className="mb-2" onChange={(e) => setTimeframe(e.target.value)} aria-label="Select Timeframe">
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Select>

        <Button variant="primary" onClick={handleFilter} className="mb-2 w-50">
          Apply Filters
        </Button>
      </div>

      <div className="export-buttons mb-4 d-flex gap-2">
        <CSVLink
          data={Array.isArray(filteredRevenues) ? filteredRevenues : []}
          filename="revenue-tracking.csv"
          className="btn btn-success"
        >
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>
          Export PDF
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <Bar data={chartData} className="revenue-tracking-chart" />
        </div>
      )}

      {/* Inline Styling */}
      <style>
        {`
          .revenue-tracking-page {
            display: flex;
            height: 100vh;
            width: 100vw;
          }

          .revenue-tracking-main {  
           padding: 6% 30px;
           width: 100%;
           height: 100%;  
           overflow-y: scroll;    
          }
           .filters{
               display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    column-gap: 10px;
    margin: 20px; 
    justify-content: space-between;
    align-items: center;
    }
    .export-buttons{
        display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    column-gap: 10px;
    margin: 20px;
    justify-content:center;
    align-items: center;
    }

    .charts {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    column-gap: 10px;
    margin: 20px;
    justify-content:space-between;
    align-items: center;

    }
    .revenue-tracking-chart {
      width: 100vh;
      height: 60vh;
      margin: 0 auto;
      margin-bottom: 50px;
      padding: 20px;
    }
    @media (max-width: 1020px) {
    .revenue-tracking-main {
      padding: 8rem 10px;
      
    }
        `}
      </style>
    </div>
    </div>
  );
};

export default RevenueTracking;
