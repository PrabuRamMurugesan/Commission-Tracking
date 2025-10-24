// pages/invoice-admin-note/[invoiceId].jsx

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

const InvoiceAdminNotePage = () => {
  
  const { invoiceId } = useParams();

  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "",
    assignTo: "",
    reminder: "",
    linkedEscalationId: "",
    gstRelated: false,
  });

  useEffect(() => {
    if (!invoiceId) return;
    fetch(`/api/invoices/${invoiceId}/admin-notes`)
      .then((r) => r.json())
      .then(setNotes)
      .catch((err) => console.error("Failed to load admin notes", err));
  }, [invoiceId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/admin-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      const newly = await res.json();
      setNotes((ns) => [...ns, newly]);
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        department: "",
        assignTo: "",
        reminder: "",
        linkedEscalationId: "",
        gstRelated: false,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  return (
    <div className="container py-4">
      <h3>Admin Note Management</h3>
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="noteTitle">
                  <Form.Label>Note Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Eg. Escrow Hold Clarification"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="linkedInvoice">
                  <Form.Label>Linked Invoice ID</Form.Label>
                  <Form.Control type="text" value={invoiceId || ""} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Form.Group controlId="noteDescription">
                  <Form.Label>Description / Discussion Thread</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={3}>
                <Form.Group controlId="notePriority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="noteDept">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Finance</option>
                    <option>Support</option>
                    <option>Sales</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="noteAssignTo">
                  <Form.Label>Assign To</Form.Label>
                  <Form.Control
                    type="text"
                    name="assignTo"
                    value={form.assignTo}
                    onChange={handleChange}
                    placeholder="Assign user/role"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="noteReminder">
                  <Form.Label>Reminder</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="reminder"
                    value={form.reminder}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3 align-items-center">
              <Col md={4}>
                <Form.Group controlId="escalationId">
                  <Form.Label>Linked Escalation ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="linkedEscalationId"
                    value={form.linkedEscalationId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Check
                  label="GST / Wallet Related"
                  name="gstRelated"
                  checked={form.gstRelated}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4} className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleSave}>
                  Save Note
                </Button>
                <Button
                  variant="success"
                  className="ms-2"
                  onClick={() => alert("Notify")}
                >
                  Notify
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => alert("Escalate")}
                >
                  Escalate
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => alert("Export")}
                >
                  Export
                </Button>
                <Button
                  variant="info"
                  className="ms-2"
                  onClick={() => alert("AI Suggest")}
                >
                  AI Suggest
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <h5>Existing Notes</h5>
      {notes.length ? (
        notes.map((n, i) => (
          <Card key={i} className="mb-2">
            <Card.Body>
              <h6>{n.title}</h6>
              <p>{n.description}</p>
              <small>
                By <strong>{n.createdBy}</strong> on{" "}
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-muted">No notes yet.</p>
      )}
    </div>
  );
};

export default InvoiceAdminNotePage;
