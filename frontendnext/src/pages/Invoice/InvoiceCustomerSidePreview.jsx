// File: InvoiceCustomerSidePreview.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
// import "./InvoiceCustomerSidePreview.css"; // Optional: print CSS

export default function InvoiceCustomerSidePreview() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) {
      alert("No invoice selected");
      return navigate("/invoice-list");
    }
    fetch(`/api/invoices/${invoiceId}`)
      .then((res) => res.json())
      .then(({ success, invoice }) => {
        if (!success) throw new Error("Invoice not found");
        setInvoice(invoice);
        console.log(invoice.items, "invoice data");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load invoice");
        navigate("/invoice-list");
      })
      .finally(() => setLoading(false));
  }, [invoiceId, navigate]);

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

  // Calculate line totals if needed
  const lines = invoice.items.map((it, i) => {
    const rate = Number(it.rate) || 0;
    const qty = Number(it.quantity) || 0;
    const gross = rate * qty;
    const discAmt = (gross * (Number(it.discount) || 0)) / 100;
    const taxable = gross - discAmt;
    const cgAmt = (taxable * (Number(it.cgst) || 0)) / 100;
    const sgAmt = (taxable * (Number(it.sgst) || 0)) / 100;
    const igAmt = (taxable * (Number(it.igst) || 0)) / 100;
    const total = taxable + cgAmt + sgAmt + igAmt;
    return { ...it, lineTotal: total.toFixed(2), cgAmt, sgAmt, igAmt, discAmt };
  });
  // after you build `lines` array:
  const totalCGST = lines.reduce((sum, ln) => sum + ln.cgAmt, 0).toFixed(2);
  const totalSGST = lines.reduce((sum, ln) => sum + ln.sgAmt, 0).toFixed(2);
  const totalIGST = lines.reduce((sum, ln) => sum + ln.igAmt, 0).toFixed(2);
  // in InvoiceCustomerSidePreview.jsx, after you have `invoice`:

  const pf = Number(invoice.platformFees) || 0;
  const coupon = Number(invoice.couponAmount) || 0;
  const wallet = Number(invoice.walletUsed) || 0;

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          {/* Top Actions */}
          <div className="d-flex justify-content-between mb-3 no-print">
            <Link to={`/invoice-summaryBox/${invoiceId}`}>
              <Button variant="light">‹ Back</Button>
            </Link>
            <div>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => window.print()}
              >
                Download PDF
              </Button>
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button variant="outline-secondary" className="me-2">
                Share Link
              </Button>
              <Button variant="success">Contact Support</Button>
            </div>
          </div>

          {/* Title */}
          <h5 className="mb-4">Customer Invoice Preview</h5>

          {/* Invoice Info */}
          <Row className="mb-3">
            <Col md={6}>
              <p>
                <strong>Invoice No:</strong> {invoice.invoiceNumber}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  bg={
                    invoice.amountPaid >= invoice.grandTotal
                      ? "success"
                      : "warning"
                  }
                >
                  {invoice.amountPaid >= invoice.grandTotal
                    ? "Paid"
                    : invoice.amountPaid > 0
                    ? "Partial"
                    : "Unpaid"}
                </Badge>
              </p>
              <p>
                <strong>Payment Mode:</strong> {invoice.paymentMode}
              </p>
            </Col>
            <Col md={6} className="text-end">
              <p>
                <strong>Platform:</strong>{" "}
                <Badge bg="info">{invoice.platform}</Badge>
              </p>
            </Col>
          </Row>
          <hr />

          {/* Billing & Shipping */}
          <Row className="mb-4">
            <Col md={6}>
              <h6>Billing Details</h6>
              <p>
                {invoice.buyerName}
                <br />
                {invoice.billingAddress}
                <br />
                {invoice.buyerEmail}
                <br />
                {invoice.buyerPhone}
              </p>
            </Col>
            <Col md={6}>
              <h6>Shipping Details</h6>
              <p>{invoice.shippingAddress || "Same as billing"}</p>
            </Col>
          </Row>

          {/* Products Table */}
          <Table bordered responsive className="mb-4">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((ln, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{ln.itemName}</td>
                  <td>{ln.hsn}</td>
                  <td>{ln.quantity}</td>
                  <td>₹{ln.rate}</td>
                  <td>₹{ln.discAmt.toFixed(2)}</td>
                  <td>₹{ln.cgAmt.toFixed(2)}</td>
                  <td>₹{ln.sgAmt.toFixed(2)}</td>
                  <td>₹{ln.igAmt.toFixed(2)}</td>
                  <td>₹{ln.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Summary */}
          <h6>Summary</h6>
          <Table bordered className="mb-0 w-50">
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>₹{invoice.subtotal}</td>
              </tr>
              <tr>
                <td>CGST</td>
                <td>₹{totalCGST}</td>
              </tr>
              <tr>
                <td>SGST</td>
                <td>₹{totalSGST}</td>
              </tr>
              <tr>
                <td>IGST</td>
                <td>₹{totalIGST}</td>
              </tr>
              <tr>
                <td>Platform Charges</td>
                <td>₹{pf}</td>
              </tr>
              <tr>
                <td>Coupon Discount</td>
                <td>₹{coupon}</td>
              </tr>
              <tr>
                <td>Wallet Used</td>
                <td>₹{wallet}</td>
              </tr>
              <tr>
                <td>
                  <strong>Grand Total</strong>
                </td>
                <td>
                  <strong>₹{invoice.grandTotal}</strong>
                </td>
              </tr>
              <tr>
                <td>Amount Paid</td>
                <td>₹{invoice.amountPaid}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
