// File: InvoiceSummaryBox.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button, Spinner } from "react-bootstrap";

export default function InvoiceSummaryBox() {
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
      .then((r) => r.json())
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

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <h5>💰 Invoice Summary</h5>
          <Row>
            {/* Left Column */}
            <Col md={6}>
              <p>
                <strong>Subtotal:</strong> ₹{invoice.subtotal}
              </p>
              <p>
                <strong>Discount:</strong> ₹{invoice.totalDiscount}
              </p>
              <p>
                <strong>Coupon Code:</strong> {invoice.couponCode}
              </p>
              <p>
                <strong>Round-Off Adjustment:</strong> ₹{invoice.roundOff}
              </p>
              <p>
                <strong>Platform Fees:</strong> ₹{invoice.platformFees}
              </p>
              <hr />
              <p>
                <strong>Final Subtotal:</strong> ₹
                {invoice.finalSubtotal ||
                  invoice.subtotal -
                    invoice.totalDiscount -
                    invoice.couponAmount +
                    invoice.platformFees +
                    invoice.roundOff}
              </p>
              <hr />
              <p>
                <strong>Wallet / Golddex</strong>
              </p>
              <p>Wallet Used: ₹{invoice.walletUsed}</p>
              <p>Balance Before: ₹{invoice.walletBalanceBefore}</p>
              <p>Balance After: ₹{invoice.walletBalanceAfter}</p>
              <hr />
              <p>
                <strong>Escrow Details</strong>
              </p>
              <p>Amount: ₹{invoice.escrowAmount}</p>
              <p>Status: {invoice.escrowStatus}</p>
              <p>Escrow ID: {invoice.escrowId}</p>
              <hr />
              <p>
                <strong>Commission Summary</strong>
              </p>
              <p>
                Vendor Commission ({invoice.vendorCommissionPct}%): ₹
                {invoice.vendorCommissionAmt}
              </p>
              <p>
                Agent Commission ({invoice.agentCommissionPct}%): ₹
                {invoice.agentCommissionAmt}
              </p>
              <p>Platform Commission: ₹{invoice.platformCommissionAmt}</p>
              <p>
                <strong>Final Payout to Vendor:</strong> ₹
                {invoice.finalPayoutToVendor}
              </p>
            </Col>

            {/* Right Column */}
            <Col md={6}>
              <p>
                <strong>GST Breakdown</strong>
              </p>
              <p>
                CGST ({invoice.globalCGST}%): ₹{invoice.cgstAmount}
              </p>
              <p>
                SGST ({invoice.globalSGST}%): ₹{invoice.sgstAmount}
              </p>
              <p>
                IGST ({invoice.globalIGST}%): ₹{invoice.igstAmount}
              </p>
            </Col>
          </Row>

          <div className="mt-4">
            <Button variant="outline-primary">Export PDF</Button>{" "}
            <Button variant="light">Print</Button>{" "}
            <Button variant="success">Customer View</Button>
            <Link to={`/invoice-customerSidePreview/${invoice._id}`}>
              <Button variant="warning" size="sm">
                Customer View
              </Button>
            </Link>
          </div>

          <hr />
          <small className="text-muted">
            💡 Future Features: AI Breakdown Summary, QR-based Payment block,
            Role-based editing toggle, Audit trail.
          </small>
        </Card.Body>
      </Card>
    </Container>
  );
}
