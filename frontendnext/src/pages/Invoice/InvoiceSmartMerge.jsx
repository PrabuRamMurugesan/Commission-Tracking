import React, { useState } from "react";
import { Button, Form, Row, Col, Table, Modal } from "react-bootstrap";

const InvoiceSmartMerge = () => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [mergeTitle, setMergeTitle] = useState("");
  const [mergeType, setMergeType] = useState("customer");
  const [discount, setDiscount] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const invoices = [
    {
      id: "INV101",
      customer: "Arun",
      amount: 1500,
      platform: "BBSCART",
      status: "Paid",
    },
    {
      id: "INV102",
      customer: "Sita",
      amount: 2500,
      platform: "Golddex",
      status: "Unpaid",
    },
    {
      id: "INV103",
      customer: "Raj",
      amount: 3200,
      platform: "Delivery",
      status: "Partial",
    },
  ];

  const handleSelect = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((inv) => inv !== id) : [...prev, id]
    );
  };

  const handlePreview = () => setShowPreview(true);
  const handleClosePreview = () => setShowPreview(false);

  return (
    <div className="container mt-4">
      <h3>Invoice Smart Merge</h3>
      <Form className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Merge Title</Form.Label>
              <Form.Control
                type="text"
                value={mergeTitle}
                onChange={(e) => setMergeTitle(e.target.value)}
                placeholder="e.g., March Orders - Raj"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Merge Type</Form.Label>
              <Form.Select
                value={mergeType}
                onChange={(e) => setMergeType(e.target.value)}
              >
                <option value="customer">Customer-wise</option>
                <option value="platform">Platform-wise</option>
                <option value="month">Month-wise</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Apply Discount (₹ or %)</Form.Label>
              <Form.Control
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Service Fee (₹)</Form.Label>
              <Form.Control
                type="number"
                value={serviceFee}
                onChange={(e) => setServiceFee(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Select</th>
            <th>Invoice ID</th>
            <th>Customer</th>
            <th>Platform</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>
                <Form.Check
                  checked={selectedInvoices.includes(inv.id)}
                  onChange={() => handleSelect(inv.id)}
                />
              </td>
              <td>{inv.id}</td>
              <td>{inv.customer}</td>
              <td>{inv.platform}</td>
              <td>₹{inv.amount}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="primary" onClick={handlePreview}>
          Preview Merge
        </Button>
        <Button variant="success">Save Merged Invoice</Button>
      </div>

      <Modal show={showPreview} onHide={handleClosePreview}>
        <Modal.Header closeButton>
          <Modal.Title>Merge Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Title:</strong> {mergeTitle}
          </p>
          <p>
            <strong>Type:</strong> {mergeType}
          </p>
          <p>
            <strong>Discount:</strong> {discount}
          </p>
          <p>
            <strong>Service Fee:</strong> ₹{serviceFee}
          </p>
          <p>
            <strong>Invoices Selected:</strong> {selectedInvoices.join(", ")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreview}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceSmartMerge;
