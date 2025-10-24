// File: InvoiceDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Row,
  Col,
  Spinner,
  Button,
  Card,
} from "react-bootstrap";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      alert("No invoice selected");
      return navigate("/invoice-list");
    }
    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then(({ success, invoice }) => {
        if (!success) throw new Error("Invoice not found");
        setInvoice(invoice);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load invoice");
        navigate("/invoice-list");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

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
          <Button>Back to List</Button>
        </Link>
      </Container>
    );
  }

  // Pre-calc summary
  const taxable = invoice.subtotal;
  const cgstAmt = (taxable * invoice.globalCGST) / 100;
  const sgstAmt = (taxable * invoice.globalSGST) / 100;
  const igstAmt = (taxable * invoice.globalIGST) / 100;
  const totalTax = cgstAmt + sgstAmt + igstAmt;
  const grandTotal = invoice.finalPayable;
  const paid = invoice.amountPaid || 0;
  const wallet = invoice.walletPaid || 0;
  const escrow = invoice.escrowHeld || 0;
  const pending = grandTotal - paid;

  return (
    <Container className="py-4">
      <h3 className="mb-4">Invoice Details – {invoice.invoiceNumber}</h3>

      {/* NAV ACTIONS */}
      <Row className="mb-3">
        <Col>
          {/* Back to list */}
          <Link to="/invoice-list">
            <Button variant="secondary" size="sm">
              &larr; Back to List
            </Button>
          </Link>
          {/* Print Preview */}
          <Link to={`/invoice-printPreview/${invoice._id}`}>
            <Button variant="primary" size="sm">
              Print
            </Button>
          </Link>

          <Link to={`/invoice-admin-note/${invoice._id}`}>
            <Button variant="primary" size="sm">
              Admin Note
            </Button>
          </Link>
          <Link to={`/invoice-audit/${invoice._id}`}>
            <Button variant="primary" size="sm">
              AuditLog
            </Button>
          </Link>
          {/* NEW: GST Tax Breakdown */}
          <Link to={`/invoice-taxBreakdown/${invoice._id}`}>
            <Button variant="info" size="sm">
              GST Tax Breakdown
            </Button>
          </Link>
          <Link to={`/invoices/${invoice._id}/escrowInfo`}>
            <Button variant="info" size="sm">
              Escrow Info
            </Button>
          </Link>
          {/* NEW:  Invoice Summary-Box */}
          <Link to={`/invoice-summaryBox/${invoice._id}`}>
            <Button variant="warning" size="sm">
              Invoice Summary
            </Button>
          </Link>
        </Col>
      </Row>

      {/* ITEMS / SERVICES */}
      <Card className="mb-4">
        <Card.Header>Items / Services</Card.Header>
        <Table bordered responsive className="mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>HSN Code</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Tax % (CGST+SGST)</th>
              <th>Tax ₹</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it, i) => {
              const gross = it.rate * it.quantity;
              const discAmt = gross * (it.discount / 100);
              const taxable = gross - discAmt;
              const lineTaxPerc =
                invoice.globalCGST + invoice.globalSGST + invoice.globalIGST;
              const lineTaxAmt = (taxable * lineTaxPerc) / 100;
              const lineTotal = taxable + lineTaxAmt;
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{it.itemName}</td>
                  <td>{it.hsn}</td>
                  <td>{it.quantity}</td>
                  <td>₹{it.rate}</td>
                  <td>{it.discount}%</td>
                  <td>
                    {lineTaxPerc}% ({invoice.globalCGST}% + {invoice.globalSGST}
                    %{invoice.globalIGST > 0 ? ` + ${invoice.globalIGST}%` : ""}
                    )
                  </td>
                  <td>₹{lineTaxAmt.toFixed(2)}</td>
                  <td>₹{lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      {/* PAYMENT SUMMARY & GST BREAKDOWN */}
      <Card>
        <Card.Header>Payment Summary &amp; GST Breakdown</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <strong>Taxable Subtotal:</strong> ₹{taxable}
            </Col>
            <Col md={4}>
              <strong>Shipping Charges:</strong> ₹{invoice.shippingCharges}
            </Col>
            <Col md={4}>
              <strong>Other Charges:</strong> ₹{invoice.otherCharges}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <strong>Invoice Type:</strong> {invoice.invoiceType}
            </Col>
            <Col md={4}>
              <strong>CGST %:</strong> {invoice.globalCGST}% &nbsp;{" "}
              <strong>₹{cgstAmt.toFixed(2)}</strong>
            </Col>
            <Col md={4}>
              <strong>SGST %:</strong> {invoice.globalSGST}% &nbsp;{" "}
              <strong>₹{sgstAmt.toFixed(2)}</strong>
            </Col>
          </Row>
          {invoice.globalIGST > 0 && (
            <Row className="mb-3">
              <Col md={4}>
                <strong>IGST %:</strong> {invoice.globalIGST}% &nbsp;{" "}
                <strong>₹{igstAmt.toFixed(2)}</strong>
              </Col>
            </Row>
          )}
          <hr />
          <Row className="mb-2">
            <Col md={4}>
              <strong>Total Tax Amount:</strong> ₹{totalTax.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <strong>Amount Paid:</strong> ₹{paid.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>Paid via Wallet:</strong> ₹{wallet.toFixed(2)}
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <strong>Escrow Held:</strong> ₹{escrow.toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>Pending Amount:</strong> ₹{pending.toFixed(2)}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
