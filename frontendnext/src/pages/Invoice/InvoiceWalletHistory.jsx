import React, { useState } from "react";
import { Table, Button, Form, Row, Col, Card, Badge } from "react-bootstrap";

const InvoiceWalletHistory = () => {
  const [filters, setFilters] = useState({
    search: "",
    platform: "",
    type: "",
    status: "",
  });

  const walletData = [
    {
      txnId: "WLTX12345",
      date: "2025-06-05",
      invoiceId: "INV001",
      escrowId: "ESC789",
      platform: "Golddex",
      type: "Credit",
      reason: "Partial Payment",
      amount: "₹1,200",
      status: "Completed",
      notes: "Auto-linked from Golddex",
    },
    {
      txnId: "WLTX67890",
      date: "2025-06-04",
      invoiceId: "INV002",
      escrowId: "ESC222",
      platform: "BBSCART",
      type: "Debit",
      reason: "Refund to Wallet",
      amount: "₹800",
      status: "Pending",
      notes: "Awaiting admin confirmation",
    },
  ];

  return (
    <div className="container mt-4">
      <h4>Invoice Wallet History</h4>

      {/* KPI Tiles */}
      <Row className="mb-4">
        <Col md={3}>
          <Card body>Total Wallet Usage: ₹2,000</Card>
        </Col>
        <Col md={3}>
          <Card body>Escrow Linked: ₹1,500</Card>
        </Col>
        <Col md={3}>
          <Card body>Refunded: ₹800</Card>
        </Col>
        <Col md={3}>
          <Card body>Pending Actions: 1</Card>
        </Col>
      </Row>

      {/* Filters */}
      <Form className="mb-3">
        <Row>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search Txn ID / Invoice ID"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filters.platform}
              onChange={(e) =>
                setFilters({ ...filters, platform: e.target.value })
              }
            >
              <option value="">Filter by Platform</option>
              <option>Golddex</option>
              <option>BBSCART</option>
              <option>Delivery</option>
              <option>Emerjobs</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Type</option>
              <option>Credit</option>
              <option>Debit</option>
              <option>Refund</option>
              <option>Hold</option>
              <option>Manual</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Reversed</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Export Options */}
      <div className="mb-3 d-flex justify-content-end gap-2">
        <Button variant="success">Export CSV</Button>
        <Button variant="secondary">Export PDF</Button>
        <Button variant="primary">Print Ledger</Button>
      </div>

      {/* Wallet Transaction Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Date</th>
            <th>Invoice ID</th>
            <th>Escrow ID</th>
            <th>Platform</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {walletData.map((txn, idx) => (
            <tr key={idx}>
              <td>{txn.txnId}</td>
              <td>{txn.date}</td>
              <td>
                <Button variant="link">{txn.invoiceId}</Button>
              </td>
              <td>{txn.escrowId}</td>
              <td>
                <Badge bg="info">{txn.platform}</Badge>
              </td>
              <td>{txn.type}</td>
              <td>{txn.reason}</td>
              <td>{txn.amount}</td>
              <td>
                <Badge bg={txn.status === "Completed" ? "success" : "warning"}>
                  {txn.status}
                </Badge>
              </td>
              <td>{txn.notes}</td>
              <td>
                <Button size="sm">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InvoiceWalletHistory;
