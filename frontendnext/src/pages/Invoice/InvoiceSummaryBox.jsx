import React from "react";
import { Card, Button, Row, Col, Form, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const InvoiceSummaryBox = () => {
    const navigate = useNavigate();
  const dummyData = {
    subtotal: 10000,
    discount: 500,
    coupon: "NEW500",
    roundOff: -1,
    platformFees: 100,
    finalSubtotal: 9599,
    cgst: 5,
    sgst: 5,
    igst: 0,
    cgstAmount: 480,
    sgstAmount: 480,
    igstAmount: 0,
    walletUsed: 1000,
    walletBalanceBefore: 2000,
    walletBalanceAfter: 1000,
    escrowAmount: 5000,
    escrowStatus: "Held",
    escrowId: "ESC123456",
    vendorCommission: 7,
    vendorCommissionAmount: 600,
    agentCommission: 3,
    agentCommissionAmount: 250,
    platformCommissionAmount: 150,
    finalPayoutToVendor: 8000,
  };

  return (
    <Card className="mt-4 p-4 shadow-sm">
      <h5 className="mb-3">💰 Invoice Summary</h5>
      <Row className="mb-3">
        <Col md={6}>
          <p>
            <strong>Subtotal:</strong> ₹{dummyData.subtotal}
          </p>
          <p>
            <strong>Discount:</strong> ₹{dummyData.discount}
          </p>
          <p>
            <strong>Coupon Code:</strong> {dummyData.coupon}
          </p>
          <p>
            <strong>Round-Off Adjustment:</strong> ₹{dummyData.roundOff}
          </p>
          <p>
            <strong>Platform Fees:</strong> ₹{dummyData.platformFees}
          </p>
          <hr />
          <p>
            <strong>Final Subtotal:</strong> ₹{dummyData.finalSubtotal}
          </p>
        </Col>
        <Col md={6}>
          <h6>GST Breakdown</h6>
          <p>
            CGST ({dummyData.cgst}%): ₹{dummyData.cgstAmount}
          </p>
          <p>
            SGST ({dummyData.sgst}%): ₹{dummyData.sgstAmount}
          </p>
          <p>
            IGST ({dummyData.igst}%): ₹{dummyData.igstAmount}
          </p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <h6>Wallet / Golddex</h6>
          <p>Wallet Used: ₹{dummyData.walletUsed}</p>
          <p>Balance Before: ₹{dummyData.walletBalanceBefore}</p>
          <p>Balance After: ₹{dummyData.walletBalanceAfter}</p>
        </Col>
        <Col md={6}>
          <h6>Escrow Details</h6>
          <p>Amount: ₹{dummyData.escrowAmount}</p>
          <p>
            Status: <Badge bg="warning">{dummyData.escrowStatus}</Badge>
          </p>
          <p>Escrow ID: {dummyData.escrowId}</p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <h6>Commission Summary</h6>
          <p>
            Vendor Commission: {dummyData.vendorCommission}% → ₹
            {dummyData.vendorCommissionAmount}
          </p>
          <p>
            Agent Commission: {dummyData.agentCommission}% → ₹
            {dummyData.agentCommissionAmount}
          </p>
          <p>Platform Commission: ₹{dummyData.platformCommissionAmount}</p>
          <p>
            <strong>Final Payout to Vendor:</strong> ₹
            {dummyData.finalPayoutToVendor}
          </p>
        </Col>
        <Col md={6}>
          <h6>Actions</h6>
          <Button variant="outline-primary" className="me-2">
            Export PDF
          </Button>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => {
              navigate("/invoice-printPreview");
            }}
          >
            Print
          </Button>
          <Button
            variant="outline-success"
            onClick={() => {
              navigate("/invoice-customerSidePreview");
            }}
          >
            Customer View
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <hr />
          <p className="text-muted">
            💡 Future Features: AI Breakdown Summary, QR-based Payment block,
            Role-based editing toggle, Audit trail.
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default InvoiceSummaryBox;
