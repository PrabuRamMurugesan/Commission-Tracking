// InvoicePreviewPage.jsx (Page 6 of 18)
import React from "react";
import { Card, Row, Col, Table, Button, Badge } from "react-bootstrap";

const InvoicePreviewPage = () => {
  return (
    <div className="container mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h4>Invoice Preview – INV-BBS-2025-0145</h4>
        </Col>
        <Col className="text-end">
          <Badge bg="success">PAID</Badge>
        </Col>
      </Row>

      {/* Vendor & Customer Info */}
      <Card className="mb-4">
        <Card.Header>Vendor & Customer Info</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Vendor:</h6>
              <p>
                Thiaworld Jewellers
                <br />
                GSTIN: 33ABC1234X1Z3
                <br />
                Puducherry
                <br />
                Pickup: Anna Nagar
              </p>
            </Col>
            <Col md={6}>
              <h6>Customer:</h6>
              <p>
                Bala Bharath
                <br />
                GSTIN: -<br />
                Puducherry
                <br />
                Phone: 9876543210
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>Order ID:</strong> ORD-09876
            </Col>
            <Col>
              <strong>Transaction ID:</strong> TXN-GDX-4477
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Items */}
      <Card className="mb-4">
        <Card.Header>Invoice Items</Card.Header>
        <Card.Body>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate (₹)</th>
                <th>Discount</th>
                <th>HSN</th>
                <th>Tax %</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>22K Gold Chain</td>
                <td>1</td>
                <td>15000</td>
                <td>500</td>
                <td>7113</td>
                <td>5%</td>
                <td>375</td>
                <td>375</td>
                <td>0</td>
                <td>15750</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* GST + Summary */}
      <Card className="mb-4">
        <Card.Header>Tax & Payment Summary</Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col md={4}>
              <strong>Taxable Value:</strong> ₹14,500
            </Col>
            <Col md={4}>
              <strong>Platform Fee:</strong> ₹200
            </Col>
            <Col md={4}>
              <strong>Invoice Type:</strong> Intra-State
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <strong>CGST (2.5%):</strong> ₹375
            </Col>
            <Col md={4}>
              <strong>SGST (2.5%):</strong> ₹375
            </Col>
            <Col md={4}>
              <strong>IGST (0%):</strong> ₹0
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <strong>Wallet Paid:</strong> ₹8000
            </Col>
            <Col md={4}>
              <strong>Escrow Held:</strong> ₹7750
            </Col>
            <Col md={4}>
              <strong>Total:</strong> ₹15,750
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Notes */}
      <Card className="mb-4">
        <Card.Header>Notes & Terms</Card.Header>
        <Card.Body>
          <p>
            Payment received via Golddex wallet and balance held in escrow.
            Refunds processed only after T+3 days.
          </p>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="text-end">
        <Button variant="primary" className="me-2">
          Submit Invoice
        </Button>
        <Button variant="secondary" className="me-2">
          Edit
        </Button>
        <Button variant="info" className="me-2">
          Print
        </Button>
        <Button variant="success" className="me-2">
          Download PDF
        </Button>
        <Button variant="dark">Share Invoice</Button>
      </div>
    </div>
  );
};

export default InvoicePreviewPage;
