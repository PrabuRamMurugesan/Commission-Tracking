import React from "react";
import { Button, Table, Card, Row, Col, Badge } from "react-bootstrap";

const InvoiceCustomerSidePreview = () => {
  const invoiceData = {
    invoiceNo: "INV-2025-0912",
    date: "2025-06-05",
    customerName: "Bala Bharath",
    email: "bala@bbscart.com",
    phone: "+91 9876543210",
    billingAddress: "7, Bharathi Street, Puducherry - 605005",
    shippingAddress: "Same as billing",
    platform: "BBSCART",
    status: "Paid",
    subtotal: 4800,
    cgst: 432,
    sgst: 432,
    igst: 0,
    platformCharges: 100,
    coupon: 150,
    total: 5614,
    walletUsed: 500,
    amountPaid: 5614,
    paymentMode: "UPI",
  };

  const items = [
    {
      name: "Gold Chain - Classic",
      sku: "GCH1001",
      qty: 1,
      price: 5000,
      discount: 200,
      cgst: 216,
      sgst: 216,
      igst: 0,
      total: 5232,
    },
  ];

  return (
    <Card className="p-4 m-3">
      <h4 className="mb-4">Customer Invoice Preview</h4>

      <Row className="mb-3">
        <Col md={6}>
          <strong>Invoice No:</strong> {invoiceData.invoiceNo} <br />
          <strong>Date:</strong> {invoiceData.date} <br />
          <strong>Platform:</strong>{" "}
          <Badge bg="success">{invoiceData.platform}</Badge>
        </Col>
        <Col md={6}>
          <strong>Status:</strong>{" "}
          <Badge bg={invoiceData.status === "Paid" ? "success" : "warning"}>
            {invoiceData.status}
          </Badge>{" "}
          <br />
          <strong>Payment Mode:</strong> {invoiceData.paymentMode}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <h6>Billing Details</h6>
          <p>
            {invoiceData.customerName} <br />
            {invoiceData.email} <br />
            {invoiceData.phone} <br />
            {invoiceData.billingAddress}
          </p>
        </Col>
        <Col md={6}>
          <h6>Shipping Details</h6>
          <p>{invoiceData.shippingAddress}</p>
        </Col>
      </Row>

      <h5>Products</h5>
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
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{item.discount}</td>
              <td>₹{item.cgst}</td>
              <td>₹{item.sgst}</td>
              <td>₹{item.igst}</td>
              <td>₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5>Summary</h5>
      <Table bordered>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>₹{invoiceData.subtotal}</td>
          </tr>
          <tr>
            <td>CGST</td>
            <td>₹{invoiceData.cgst}</td>
          </tr>
          <tr>
            <td>SGST</td>
            <td>₹{invoiceData.sgst}</td>
          </tr>
          <tr>
            <td>IGST</td>
            <td>₹{invoiceData.igst}</td>
          </tr>
          <tr>
            <td>Platform Charges</td>
            <td>₹{invoiceData.platformCharges}</td>
          </tr>
          <tr>
            <td>Coupon Discount</td>
            <td>- ₹{invoiceData.coupon}</td>
          </tr>
          <tr>
            <td>Wallet Used</td>
            <td>- ₹{invoiceData.walletUsed}</td>
          </tr>
          <tr>
            <td>
              <strong>Grand Total</strong>
            </td>
            <td>
              <strong>₹{invoiceData.total}</strong>
            </td>
          </tr>
          <tr>
            <td>Amount Paid</td>
            <td>₹{invoiceData.amountPaid}</td>
          </tr>
        </tbody>
      </Table>

      <Row className="mt-4">
        <Col>
          <Button variant="primary" className="me-2">
            Download PDF
          </Button>
          <Button variant="secondary" className="me-2">
            Print
          </Button>
          <Button variant="outline-dark" className="me-2">
            Share Link
          </Button>
          <Button variant="success">Contact Support</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default InvoiceCustomerSidePreview;
