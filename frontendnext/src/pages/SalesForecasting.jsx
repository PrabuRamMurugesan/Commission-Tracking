import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const SalesForecasting = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("/api/sales-forecasting");
      setSalesData(response.data);
      setFilteredSales(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales forecasting data:", error);
      setError("Failed to load sales forecasts.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = salesData;
    if (role) {
      filtered = filtered.filter(sale => sale.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(sale => sale.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(sale => sale.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(sale => sale.periodType === "Yearly");
    }
    setFilteredSales(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Forecasting Report", 20, 10);
    doc.autoTable({
      head: [["Date", "User", "Role", "Projected Sales ($)"]],
      body: filteredSales.map(sale => [
        sale.date,
        sale.name,
        sale.role,
        sale.projectedSales
      ]),
    });
    doc.save("sales-forecasting.pdf");
  };

  const chartData = {
    // labels: filteredSales.map(sale => sale.date),
    datasets: [
      {
        label: "Projected Sales ($)",
        // data: filteredSales.map(sale => sale.projectedSales),
        backgroundColor: ["#3498db"],
        borderColor: ["#2980b9"],
        borderWidth: 1,
      },
    ],
  };console.log(filteredSales);if (Array.isArray(filteredSales)) {
    const chartData = {
      labels: filteredSales.map(sale => sale.date),
      datasets: [
        {
          label: "Projected Sales ($)",
          data: filteredSales.map(sale => sale.projectedSales),
          backgroundColor: ["#3498db"],
          borderColor: ["#2980b9"],
          borderWidth: 1,
        },
      ],
    };
  } else {
    console.error("filteredSales is not an array");
  }

  return (
    <div className="sales-forecasting-page">
      <Sidebar/>
      <div className="sales-forecasting-container">
      <h2 className="text-primary mb-4">📈 Sales Forecasting</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="CustomerBecomeAVendorMarketplace">CustomerBecomeAVendorMarketplace</option>
          <option value="Referral">Referral</option>
          
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>

        <Button className="btn btn-primary w-50" variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={filteredSales} filename="sales-forecasting.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button  variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading sales forecasting data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="charts">
          <Line className="sales-forecasting-chart" data={chartData} />
        </div>
      )}
      <style>
        {`
          .sales-forecasting-page {
          display: flex;
          width: 100vw;
          height: 100vh;
        }
          .sales-forecasting-container {
          padding: 7% 20px;
          width: 100%;
          height: 100%;
          overflow-y: scroll;
        }
          .filters {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          margin: 20px;
        }
          .export-buttons {
          display: flex;
          gap: 10px;
          margin: 30px;
        }
          .sales-forecasting-chart {
           width: 100vh;
      height: 60vh;
      margin: 0 auto;
      margin-bottom: 50px;
      padding: 20px;
        }

        @media (max-width: 768px) {
        .sales-forecasting-container {
          padding: 7rem 10px;
        }
        `}
      </style>
    </div>

    </div>
  );
};

export default SalesForecasting;
