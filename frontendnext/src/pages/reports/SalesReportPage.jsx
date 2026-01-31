import React, { useEffect, useState } from "react";
import SalesReportTable from "../../components/Reports/SalesReportTable";
import axios from "axios";
import { Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportSalesDataToExcel } from "../../utils/exportToExcel";

const SalesReportPage = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    platform: "",
    sellerRole: "",
    paymentStatus: "",
    orderStatus: "",
    paymentMethod: "",
    sellerName: "",
    search: "",
  });

  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    orders: 0,
    revenue: 0,
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const fetchSalesData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      };

      const res = await axios.get("/api/reports/sales", { params });
      console.log("🟢 Sales API Response:", res.data); // <-- ADD THIS LINE

      setSalesData(res.data.transactions);
      console.log(res.data.transactions, "🟢res.data.transactions");

      setSummary(res.data.summary || {});
    } catch (err) {
      console.error("❌ Sales API Error:", err); // <-- ADD THIS TOO
      setError("Failed to fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        download: true,
      };
      window.open(
        `/api/reports/sales?${new URLSearchParams(params).toString()}`
      );
    } catch (err) {
      alert("Failed to export data");
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div className="container-fluid vw-100 vh-100 border p-5 d-flex flex-column mt-5">
      <h2 className="mb-4">Sales Report</h2>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Date Range (Start)</Form.Label>
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            className="form-control"
            placeholderText="Start Date"
          />
        </Col>
        <Col md={3}>
          <Form.Label>Date Range (End)</Form.Label>
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            className="form-control"
            placeholderText="End Date"
          />
        </Col>
        <Col md={3}>
          <Form.Label>Platform</Form.Label>
          <Form.Control
            as="select"
            name="platform"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="BBSCART">BBSCART</option>
            <option value="Golddex">Golddex</option>
            <option value="Thiaworld">Thiaworld</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Label>Seller Role</Form.Label>
          <Form.Control
            as="select"
            name="sellerRole"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="agent">Agent</option>
            <option value="vendor">Vendor</option>
            <option value="cbav">CBAV</option>
          </Form.Control>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Payment Status</Form.Label>
          <Form.Control
            as="select"
            name="paymentStatus"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="escrow">Escrow</option>
            <option value="failed">Failed</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Label>Order Status</Form.Label>
          <Form.Control
            as="select"
            name="orderStatus"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Label>Payment Method</Form.Label>
          <Form.Control
            as="select"
            name="paymentMethod"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="wallet">Wallet</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Netbanking</option>
            <option value="cod">Cash on Delivery</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Label>Seller Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Seller"
            name="sellerName"
            onChange={handleFilterChange}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Order ID / Txn ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Order or Txn ID"
            name="search"
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button variant="primary" onClick={fetchSalesData}>
            Apply Filters
          </Button>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button variant="success" onClick={handleExport}>
            Export to Excel
          </Button>
        </Col>
      </Row>
      <Button
        variant="success"
        onClick={() => exportSalesDataToExcel(salesData)}
      >
        Export Excel
      </Button>
      {/* Summary Header */}
      <div className="mb-3">
        <strong>Total Orders:</strong> {summary.orders} |{" "}
        <strong>Total Revenue:</strong> ₹{summary.revenue} |{" "}
        <strong>Total Quantity:</strong> {summary.quantity}
      </div>

      {/* Alert or Loader */}
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Report Table */}
      <SalesReportTable data={salesData || []} />
    </div>
  );
};

export default SalesReportPage;
