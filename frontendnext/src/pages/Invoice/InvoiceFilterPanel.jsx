// InvoiceFilterPanel.jsx — Page 12 of 18
import React, { useState } from "react";
import { Form, Button, Row, Col, Accordion, Card } from "react-bootstrap";

const InvoiceFilterPanel = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    invoiceId: "",
    customerName: "",
    gstin: "",
    platform: "",
    role: "",
    paymentStatus: "",
    dateFrom: "",
    dateTo: "",
    gstType: "",
    gstSlab: "",
    invoiceType: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({
      invoiceId: "",
      customerName: "",
      gstin: "",
      platform: "",
      role: "",
      paymentStatus: "",
      dateFrom: "",
      dateTo: "",
      gstType: "",
      gstSlab: "",
      invoiceType: "",
      paymentMethod: "",
    });
  };

  return (
    <Accordion defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>🔍 Advanced Invoice Filters</Accordion.Header>
        <Accordion.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Invoice ID</Form.Label>
                <Form.Control
                  type="text"
                  name="invoiceId"
                  value={filters.invoiceId}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Customer Name / Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Label>GSTIN</Form.Label>
                <Form.Control
                  type="text"
                  name="gstin"
                  value={filters.gstin}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  name="platform"
                  value={filters.platform}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>Delivery</option>
                  <option>Emerjobs</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={filters.role}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>Customer</option>
                  <option>Vendor</option>
                  <option>Agent</option>
                  <option>Franchisee</option>
                  <option>Territory Head</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Partial</option>
                  <option>Escrow Hold</option>
                  <option>Refunded</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Invoice Type</Form.Label>
                <Form.Select
                  name="invoiceType"
                  value={filters.invoiceType}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>Full Payment</option>
                  <option>Partial Payment</option>
                  <option>EMI</option>
                  <option>Secure Plan</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>GST Type</Form.Label>
                <Form.Select
                  name="gstType"
                  value={filters.gstType}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>CGST</option>
                  <option>SGST</option>
                  <option>IGST</option>
                  <option>Reverse</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>GST Slab</Form.Label>
                <Form.Select
                  name="gstSlab"
                  value={filters.gstSlab}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>0%</option>
                  <option>5%</option>
                  <option>12%</option>
                  <option>18%</option>
                  <option>28%</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={filters.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Wallet</option>
                  <option>Razorpay</option>
                </Form.Select>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-3">
              <Button variant="secondary" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="primary" onClick={() => onApplyFilters(filters)}>
                Apply Filters
              </Button>
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default InvoiceFilterPanel;
