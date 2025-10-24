// File: src/pages/Invoice/InvoiceDownloadOptions.jsx
import React, { useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function InvoiceDownloadOptions() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    format: "PDF",
    platform: "BBSCART",
    role: "Admin",
    fileName: "",
    watermark: false,
    includeHeader: false,
    includeSignature: false,
    pageNumbers: false,
    notes: "",
    layout: "Standard",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/invoices/downloadOptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      // Determine extension
      const ext = form.format.toLowerCase();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.fileName || "invoices"}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <h3>Download Invoice(s)</h3>
      <Card className="p-4 mb-4">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Format</Form.Label>
                <Form.Select
                  name="format"
                  value={form.format}
                  onChange={handleChange}
                >
                  <option>PDF</option>
                  <option>CSV</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Select Platform</Form.Label>
                <Form.Select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                >
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>EmerJobs</option>
                  <option>Thiaworld</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option>Admin</option>
                  <option>Vendor</option>
                  <option>Agent</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group>
                <Form.Label>File Name</Form.Label>
                <Form.Control
                  name="fileName"
                  placeholder="e.g. Invoice_BBSCART_June2025"
                  value={form.fileName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="align-self-end">
              <Form.Check
                name="watermark"
                label="Include Watermark (PAID / DRAFT / CONFIDENTIAL)"
                checked={form.watermark}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Check
                name="includeHeader"
                label="Include Platform Header"
                checked={form.includeHeader}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Check
                name="includeSignature"
                label="Include Signature Section"
                checked={form.includeSignature}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Check
                name="pageNumbers"
                label="Enable Page Numbers"
                checked={form.pageNumbers}
                onChange={handleChange}
              />
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Notes / Footer Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  placeholder="Add notes here for the invoice footer..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Choose Layout</Form.Label>
                <Form.Select
                  name="layout"
                  value={form.layout}
                  onChange={handleChange}
                >
                  <option>Standard</option>
                  <option>Compact</option>
                  <option>Detailed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={8} className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Downloading…" : "Download"}
              </Button>{" "}
              <Button
                variant="secondary"
                onClick={() => navigate("/invoice-downloadOptions/preview")}
                disabled={submitting}
              >
                Print Preview
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Dummy export history */}
      <Card className="p-3">
        <h6>Export History (dummy)</h6>
        <ul>
          <li>Last Export: 04-Jun-2025, by Admin (PDF – BBSCART)</li>
          <li>Previous Export: 01-Jun-2025, by Vendor (CSV – Golddex)</li>
        </ul>
      </Card>
    </Container>
  );
}
