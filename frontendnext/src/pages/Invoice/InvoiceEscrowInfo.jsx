import React, { useState } from "react";
import { Button, Card, Table, Form, Badge, Modal } from "react-bootstrap";

const InvoiceEscrowInfo = () => {
  const [showRefundModal, setShowRefundModal] = useState(false);

  const escrowData = {
    invoiceId: "INV-BBS-20250601",
    platform: "Golddex",
    escrowAmount: "₹15,000",
    escrowPercentage: "40%",
    escrowId: "ESCROW-957134RZP",
    walletLedgerId: "WL-4819GXD",
    startDate: "2025-06-01",
    expectedReleaseDate: "2025-06-06",
    actualReleaseDate: "",
    status: "Locked",
    statusTimeline: [
      "Escrow Created",
      "Payment Confirmed",
      "Awaiting Delivery",
    ],
    aiSummary:
      "Escrow was created on June 1st and is pending release upon delivery confirmation.",
  };

  return (
    <div className="container mt-4">
      <h3>Invoice Escrow Info</h3>

      {/* ESCROW SUMMARY CARD */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Escrow Summary</h5>
          <Table bordered>
            <tbody>
              <tr>
                <td>Invoice ID</td>
                <td>{escrowData.invoiceId}</td>
              </tr>
              <tr>
                <td>Platform</td>
                <td>{escrowData.platform}</td>
              </tr>
              <tr>
                <td>Escrow ID</td>
                <td>{escrowData.escrowId}</td>
              </tr>
              <tr>
                <td>Escrow Amount</td>
                <td>
                  {escrowData.escrowAmount} ({escrowData.escrowPercentage})
                </td>
              </tr>
              <tr>
                <td>Wallet Ledger Ref</td>
                <td>{escrowData.walletLedgerId}</td>
              </tr>
              <tr>
                <td>Start Date</td>
                <td>{escrowData.startDate}</td>
              </tr>
              <tr>
                <td>Expected Release</td>
                <td>{escrowData.expectedReleaseDate}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>
                  <Badge bg="warning">{escrowData.status}</Badge>
                </td>
              </tr>
            </tbody>
          </Table>
          <p className="text-muted">
            🧠 <strong>AI Summary:</strong> {escrowData.aiSummary}
          </p>
        </Card.Body>
      </Card>

      {/* TIMELINE */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Escrow Status Timeline</h5>
          <ul className="list-group">
            {escrowData.statusTimeline.map((event, index) => (
              <li key={index} className="list-group-item">
                {event}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      {/* ACTIONS */}
      <div className="d-flex flex-wrap gap-2">
        <Button variant="info">View Invoice</Button>
        <Button variant="success">Download Escrow PDF</Button>
        <Button variant="primary" onClick={() => setShowRefundModal(true)}>
          Initiate Refund
        </Button>
        <Button variant="secondary">AI Summary</Button>
        <Button variant="danger">Override Release Date</Button>
        <Button variant="dark">Open Dispute Resolver</Button>
        <Button variant="outline-secondary">Export Logs</Button>
        <Button variant="outline-info">Copy Escrow Ref Link</Button>
      </div>

      {/* REFUND MODAL */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Initiate Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Refund Amount</Form.Label>
              <Form.Control type="number" placeholder="Enter refund amount" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Select>
                <option>Product Not Delivered</option>
                <option>Product Issue</option>
                <option>Customer Cancellation</option>
                <option>Manual Override</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Remarks (optional)</Form.Label>
              <Form.Control as="textarea" rows={2} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Attach Proof (PDF/Image)</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">Submit Refund</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceEscrowInfo;
