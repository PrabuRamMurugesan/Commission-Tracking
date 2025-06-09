import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Badge, Modal } from "react-bootstrap";

const InvoiceAdminNote = () => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "",
    assignTo: "",
    reminder: "",
    attachment: null,
    linkedInvoice: "",
    escalationId: "",
    gstFlag: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setNote({ ...note, [name]: checked });
    } else if (type === "file") {
      setNote({ ...note, [name]: files[0] });
    } else {
      setNote({ ...note, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Note Saved:", note);
    alert("Note saved successfully!");
  };

  return (
    <Card className="mt-4 p-4">
      <h4 className="mb-4">📝 Admin Note Management</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Note Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="Eg. Escrow Hold Clarification"
              required
            />
          </Col>
          <Col md={6}>
            <Form.Label>Linked Invoice ID</Form.Label>
            <Form.Control
              type="text"
              name="linkedInvoice"
              value={note.linkedInvoice}
              onChange={handleChange}
              placeholder="INV-2025-0001"
            />
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description / Discussion Thread</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={note.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={note.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
              <option>Critical</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Department</Form.Label>
            <Form.Select
              name="department"
              value={note.department}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Accounts</option>
              <option>Legal</option>
              <option>Escrow</option>
              <option>GST</option>
              <option>Delivery Ops</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Assign To</Form.Label>
            <Form.Control
              type="text"
              name="assignTo"
              value={note.assignTo}
              onChange={handleChange}
              placeholder="Assign to user/role"
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Reminder</Form.Label>
            <Form.Control
              type="datetime-local"
              name="reminder"
              value={note.reminder}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Linked Escalation ID</Form.Label>
            <Form.Control
              type="text"
              name="escalationId"
              value={note.escalationId}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="checkbox"
              name="gstFlag"
              checked={note.gstFlag}
              onChange={handleChange}
              label="GST / Wallet Related"
            />
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Upload Attachment</Form.Label>
          <Form.Control type="file" name="attachment" onChange={handleChange} />
        </Form.Group>

        <div className="d-flex gap-3 mt-4">
          <Button type="submit" variant="primary">
            💾 Save Note
          </Button>
          <Button variant="success">📤 Notify</Button>
          <Button variant="danger">🚨 Escalate</Button>
          <Button variant="secondary">🧾 Export</Button>
          <Button variant="outline-dark">🧠 AI Suggest</Button>
        </div>
      </Form>
    </Card>
  );
};

export default InvoiceAdminNote;
