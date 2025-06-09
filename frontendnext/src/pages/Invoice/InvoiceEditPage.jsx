// InvoiceEditPage.jsx (Page 5 of 18)

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
  Badge,
} from "react-bootstrap";

const InvoiceEditPage = () => {
  const [invoice, setInvoice] = useState({
    id: "INV00123",
    date: "2025-06-01",
    due: "2025-06-05",
    platform: "BBSCART",
    type: "Combo",
    status: "Partial",
    approval: "Pending",
    customer: {
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "9876543210",
      gstin: "22AAAAA0000A1Z5",
      state: "Tamil Nadu",
      address: "Chennai, Tamil Nadu",
    },
    items: [
      {
        name: "Gold Necklace",
        hsn: "7113",
        qty: 1,
        rate: 15000,
        discount: 0,
        cgst: 2.5,
        sgst: 2.5,
        igst: 0,
      },
    ],
    platformFee: 200,
    paid: 8000,
    walletPaid: 8000,
    escrow: 7750,
  });

  const updateItem = (i, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[i][field] = value;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const total = invoice.items.reduce((sum, item) => {
    const base = item.qty * item.rate * (1 - item.discount / 100);
    const tax = base * ((item.cgst + item.sgst + item.igst) / 100);
    return sum + base + tax;
  }, 0);

  return (
    <Container fluid className="mt-4">
      <h4>Edit Invoice: {invoice.id}</h4>

      {/* Basic Info */}
      <Card className="mb-4">
        <Card.Header>Invoice Details</Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Invoice Date</Form.Label>
                <Form.Control type="date" value={invoice.date} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Due Date</Form.Label>
                <Form.Control type="date" value={invoice.due} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Platform</Form.Label>
                <Form.Select value={invoice.platform}>
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>Delivery</option>
                  <option>Emerjobs</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Customer Info */}
      <Card className="mb-4">
        <Card.Header>Customer Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Label>Name</Form.Label>
              <Form.Control value={invoice.customer.name} />
            </Col>
            <Col md={4}>
              <Form.Label>Email</Form.Label>
              <Form.Control value={invoice.customer.email} />
            </Col>
            <Col md={4}>
              <Form.Label>Phone</Form.Label>
              <Form.Control value={invoice.customer.phone} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={4}>
              <Form.Label>GSTIN</Form.Label>
              <Form.Control value={invoice.customer.gstin} />
            </Col>
            <Col md={4}>
              <Form.Label>State</Form.Label>
              <Form.Control value={invoice.customer.state} />
            </Col>
            <Col md={4}>
              <Form.Label>Address</Form.Label>
              <Form.Control value={invoice.customer.address} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Item Table */}
      <Card className="mb-4">
        <Card.Header>Invoice Items</Card.Header>
        <Card.Body>
          <Table bordered>
            <thead>
              <tr>
                <th>Item</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Disc %</th>
                <th>CGST%</th>
                <th>SGST%</th>
                <th>IGST%</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <Form.Control
                      value={item.name}
                      onChange={(e) => updateItem(i, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.hsn}
                      onChange={(e) => updateItem(i, "hsn", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.qty}
                      type="number"
                      onChange={(e) => updateItem(i, "qty", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.rate}
                      type="number"
                      onChange={(e) => updateItem(i, "rate", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.discount}
                      type="number"
                      onChange={(e) =>
                        updateItem(i, "discount", +e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.cgst}
                      type="number"
                      onChange={(e) => updateItem(i, "cgst", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.sgst}
                      type="number"
                      onChange={(e) => updateItem(i, "sgst", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={item.igst}
                      type="number"
                      onChange={(e) => updateItem(i, "igst", +e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Summary */}
      <Card className="mb-4">
        <Card.Header>Summary</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <strong>Subtotal:</strong> ₹{(total - 750).toFixed(2)}
            </Col>
            <Col md={4}>
              <strong>GST Total:</strong> ₹750.00
            </Col>
            <Col md={4}>
              <strong>Final Total:</strong> ₹{total.toFixed(2)}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={4}>
              <strong>Wallet Paid:</strong> ₹{invoice.walletPaid}
            </Col>
            <Col md={4}>
              <strong>Escrow Held:</strong> ₹{invoice.escrow}
            </Col>
            <Col md={4}>
              <strong>Amount Paid:</strong> ₹{invoice.paid}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Footer Actions */}
      <div className="d-flex justify-content-end mb-5">
        <Button variant="success" className="me-2">
          Save Changes
        </Button>
        <Button variant="secondary">Recalculate</Button>
      </div>
    </Container>
  );
};

export default InvoiceEditPage;
