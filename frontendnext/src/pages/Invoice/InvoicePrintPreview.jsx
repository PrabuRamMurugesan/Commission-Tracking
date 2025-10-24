// File: InvoicePrintPreview.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Table,
  Row,
  Col,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import "./InvoicePrintPreview.css"; // import print CSS

export default function InvoicePrintPreview() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then(({ success, invoice }) => {
        if (!success) throw new Error("Not found");
        setInvoice(invoice);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load invoice");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (!invoice) {
    return (
      <Container className="py-5 text-center">
        <p>Invoice not found.</p>
        <Link to="/invoice-list">
          <Button variant="secondary">Back to List</Button>
        </Link>
      </Container>
    );
  }

  // compute summary
  const { items = [] } = invoice;
  const subtotal = items.reduce((sum, it) => {
    const gross = it.rate * it.quantity;
    const disc = gross * (it.discount / 100);
    return sum + (gross - disc);
  }, 0);
  const totalGST = items.reduce((sum, it) => {
    const gross = it.rate * it.quantity;
    const disc = gross * (it.discount / 100);
    const taxable = gross - disc;
    return sum + taxable * ((it.cgst + it.sgst + it.igst) / 100);
  }, 0);
  const grandTotal =
    subtotal +
    totalGST +
    invoice.shippingCharges +
    invoice.otherCharges +
    invoice.roundOff;
  const paid = invoice.amountPaid || 0;
  const due = grandTotal - paid;
  const escrowStatus = invoice.useEscrow ? "Held" : "Released";

  return (
    <Container className="print-container py-4">
      {/* Print-only CSS will hide .no-print things */}
      <div className="no-print mb-3">
        
        <Link to="/invoice-details/{id}">
          <Button variant="light">‹ Back</Button>
        </Link>{" "}
        <Button variant="primary" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <h4 className="text-center mb-4">Invoice Preview</h4>
      <Row>
        <Col>
          <strong>Seller:</strong>
          <br />
          BBSCART Online Shopping
          <br />
          No.7, Bharathi Street, Puducherry
          <br />
          GSTIN: 29ABCDE1234F2Z5
          <br />
          Email: info@bbscart.com
          <br />
          Phone: 0413 291 5916
        </Col>
        <Col className="text-end">
          <strong>Invoice #: </strong> {invoice.invoiceNumber}
          <br />
          <strong>Date:</strong>{" "}
          {new Date(invoice.invoiceDate).toLocaleDateString()}
          <br />
          <strong>Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
          <br />
          <strong>Status:</strong>{" "}
          {paid >= grandTotal ? "Paid" : paid > 0 ? "Partial" : "Unpaid"}
        </Col>
      </Row>
      <hr />

      <Row className="mt-3">
        <Col>
          <strong>Buyer:</strong>
          <br />
          {invoice.buyerName}
          <br />
          {invoice.billingAddress}
          <br />
          GSTIN: {invoice.buyerGSTIN}
          <br />
          {/* add email/phone if you store them */}
        </Col>
      </Row>

      <Card className="mt-4 mb-4">
        <Card.Header>Items / Services</Card.Header>
        <Table bordered responsive className="mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>HSN/SAC</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>CGST%</th>
              <th>SGST%</th>
              <th>IGST%</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const gross = it.rate * it.quantity;
              const discAmt = gross * (it.discount / 100);
              const taxable = gross - discAmt;
              const gstAmt = taxable * ((it.cgst + it.sgst + it.igst) / 100);
              const lineTotal = taxable + gstAmt;
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{it.itemName}</td>
                  <td>{it.hsn}</td>
                  <td>{it.quantity}</td>
                  <td>₹{it.rate}</td>
                  <td>{it.discount}%</td>
                  <td>{it.cgst}%</td>
                  <td>{it.sgst}%</td>
                  <td>{it.igst}%</td>
                  <td>₹{lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Card className="mb-4">
        <Card.Header>Payment Summary & GST Breakdown</Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col md={4}>
              <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>GST Tax:</strong> ₹{totalGST.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>Total:</strong> ₹{grandTotal.toFixed(2)}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <strong>Payment Mode:</strong> {invoice.paymentMode}
            </Col>
            <Col md={4}>
              <strong>Escrow Status:</strong> {escrowStatus}
            </Col>
            <Col md={4}>
              <strong>Wallet Txn ID:</strong> {invoice.paymentReferenceId}-
              {invoice.platform}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <strong>Paid:</strong> ₹{paid.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>Due:</strong> ₹{due.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>Use Escrow:</strong> {invoice.useEscrow ? "Yes" : "No"}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {invoice.notes && (
        <div className="mb-3">
          <strong>Notes:</strong>
          <br />
          <div style={{ whiteSpace: "pre-wrap" }}>{invoice.notes}</div>
        </div>
      )}
      <p className="text-center text-muted small">
        This is a computer-generated invoice. No signature required.
      </p>

 
    </Container>
  );
}
