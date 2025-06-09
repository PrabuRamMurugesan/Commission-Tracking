// InvoiceStatusTracker.jsx (Page 8 of 18)
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Form,
  Table,
  Badge,
} from "react-bootstrap";

const InvoiceStatusTracker = () => {
  const statusTimeline = [
    { step: "Invoice Created", date: "2025-06-01", status: "done" },
    { step: "Payment Initiated", date: "2025-06-01", status: "done" },
    { step: "Partial Payment Received", date: "2025-06-02", status: "done" },
    { step: "Escrow Locked", date: "2025-06-03", status: "done" },
    { step: "Vendor Dispatched", date: "2025-06-04", status: "done" },
    { step: "Escrow Released", date: "2025-06-05", status: "done" },
    { step: "Invoice Settled", date: "2025-06-06", status: "done" },
  ];

  return (
    <Container fluid className="mt-4">
      <h4 className="mb-3">Invoice Status Tracker</h4>

      {/* Top Summary */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Invoice ID:</strong> #BBSC-INV-1024
              </p>
              <p>
                <strong>Platform:</strong> <Badge bg="success">Golddex</Badge>
              </p>
              <p>
                <strong>Customer:</strong> Ram Kumar
              </p>
              <p>
                <strong>Invoice Date:</strong> 2025-06-01
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Total:</strong> ₹15,600
              </p>
              <p>
                <strong>Escrow Status:</strong>{" "}
                <Badge bg="primary">Released</Badge>
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <Badge bg="success">Settled</Badge>
              </p>
              <ProgressBar now={100} label="Completed" className="mt-2" />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search Invoice</Form.Label>
                <Form.Control placeholder="Enter Invoice ID" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status Filter</Form.Label>
                <Form.Select>
                  <option>All</option>
                  <option>Escrow</option>
                  <option>Refund</option>
                  <option>Payment</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button variant="primary" className="w-100">
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Timeline Section */}
      <Card className="shadow-sm">
        <Card.Header>
          <strong>Status Timeline</strong>
        </Card.Header>
        <Card.Body>
          <ul className="timeline">
            {statusTimeline.map((event, index) => (
              <li key={index}>
                <p className="mb-1">
                  <strong>{event.step}</strong>
                </p>
                <p className="text-muted">{event.date}</p>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="mt-4 d-flex justify-content-end gap-2">
        <Button variant="outline-success">Export Timeline (PDF)</Button>
        <Button variant="outline-primary">Send to WhatsApp</Button>
        <Button variant="outline-secondary">Open Invoice</Button>
        <Button variant="outline-info">View Escrow Info</Button>
        <Button variant="outline-warning">AI Summary</Button>
      </div>
    </Container>
  );
};

export default InvoiceStatusTracker;
