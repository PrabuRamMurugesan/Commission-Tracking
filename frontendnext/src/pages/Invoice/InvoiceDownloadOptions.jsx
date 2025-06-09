// InvoiceDownloadOptions.jsx — Page 18 of 18
import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const InvoiceDownloadOptions = () => {
    const navigate = useNavigate();
  
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [platform, setPlatform] = useState("BBSCART");
  const [role, setRole] = useState("Admin");

  const handleDownload = () => {
    alert(`Downloading in ${selectedFormat} format for ${platform} - ${role}`);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Download Invoice(s)</h2>

      <Card className="p-4 shadow-sm">
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Select Format</Form.Label>
              <Form.Select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
                <option>Print-Optimized</option>
                <option>JSON</option>
                <option>ZIP (Bulk)</option>
                <option>UPI-PDF (Future)</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Select Platform</Form.Label>
              <Form.Select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option>BBSCART</option>
                <option>Golddex</option>
                <option>Delivery App</option>
                <option>Emerjobs</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Admin</option>
                <option>Vendor</option>
                <option>Customer</option>
                <option>Agent</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>File Name</Form.Label>
              <Form.Control placeholder="e.g. Invoice_BBSCART_June2025" />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Include Watermark (PAID / DRAFT / CONFIDENTIAL)"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Check type="checkbox" label="Include Platform Header" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Include Signature Section" />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Enable Page Numbers" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>Notes / Footer Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Add notes here for the invoice footer..."
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Choose Layout</Form.Label>
              <Form.Select>
                <option>Standard</option>
                <option>Compact</option>
                <option>Customer Layout</option>
                <option>GST Mode</option>
                <option>Golddex Escrow Format</option>
                <option>Emerjobs Freelance View</option>
              </Form.Select>
            </Col>
            <Col md={8} className="d-flex align-items-end justify-content-end">
              <Button
                variant="primary"
                onClick={handleDownload}
                className="me-2"
              >
                Download
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/invoice-printPreview");
                }}
              >
                Print Preview
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="mt-4">
        <h5>🔄 Export History (dummy)</h5>
        <ul>
          <li>Last Export: 04-Jun-2025, by Admin (PDF - BBSCART)</li>
          <li>Previous Export: 01-Jun-2025, by Vendor (CSV - Golddex)</li>
        </ul>
      </div>
    </div>
  );
};

export default InvoiceDownloadOptions;
