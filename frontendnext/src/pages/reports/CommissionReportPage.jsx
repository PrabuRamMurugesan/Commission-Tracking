import React, { useEffect, useState } from "react";
import CommissionReportTable from "../../components/Reports/CommissionReportTable";
import axios from "axios";
import { Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { exportCommissionDataToExcel } from "../../utils/exportToExcel";

const CommissionReportPage = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    platform: "",
    sellerRole: "",
    payoutStatus: "",
    paymentStatus: "",
    orderStatus: "",
    paymentMethod: "",
    sellerName: "",
    search: "",
  });

  const [commissionData, setCommissionData] = useState([]);
  const [summary, setSummary] = useState({
    commissions: 0,
    totalAmount: 0,
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

  const fetchCommissionData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      };

      const res = await axios.get("/api/reports/commissions", { params });
      console.log("Commission Report Table Data →", res.data.transactions);
      console.log("🟢 Commission API Response:", res.data);
      setCommissionData(res.data.transactions || []);
      setSummary(res.data.summary || {});
    } catch (err) {
      console.error("❌ Commission API Error:", err);
      setError("Failed to fetch commission data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const params = {
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        download: true,
      };
      window.open(
        `/api/reports/commissions?${new URLSearchParams(params).toString()}`
      );
    } catch (err) {
      alert("Failed to export data");
    }
  };

  useEffect(() => {
    fetchCommissionData();
  }, []);

  return (
    <div className="container mt-4 mb-4 d-flex flex-column gap-4 commission-report-page border rounded p-4 m-5 bg-light shadow vw-100">
      <h2 className="mb-4">Commission Report</h2>

      {/* Filters */}
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
            <option value="vendor">Vendor</option>
            <option value="agent">Agent</option>
            <option value="franchisee">Franchisee</option>
            <option value="cbav">CBAV</option>
          </Form.Control>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Payout Status</Form.Label>
          <Form.Control
            as="select"
            name="payoutStatus"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </Form.Control>
        </Col>
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
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Seller Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Seller"
            name="sellerName"
            onChange={handleFilterChange}
          />
        </Col>
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
          <Button variant="primary" onClick={fetchCommissionData}>
            Apply Filters
          </Button>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button variant="success" onClick={handleExport}>
            Export to Excel
          </Button>
        </Col>
      </Row>

      {/* Summary */}
      <div className="mb-3">
        <strong>Total Commissions:</strong> {summary.commissions} |{" "}
        <strong>Total Amount:</strong> ₹{summary.totalAmount}
      </div>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table */}
      <CommissionReportTable data={commissionData || []} />
    </div>
  );
};

export default CommissionReportPage;
