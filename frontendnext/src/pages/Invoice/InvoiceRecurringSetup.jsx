import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";

const InvoiceRecurringSetup = () => {
  const [formData, setFormData] = useState({
    customer: "",
    platform: "BBSCART",
    product: "",
    startDate: "",
    endDate: "",
    noEndDate: false,
    frequency: "Monthly",
    customFreq: "",
    nextInvoiceDate: "2025-07-01",
    template: "",
    currency: "INR",
    taxType: "GST",
    autoEmail: true,
    autoWhatsApp: false,
    reminderBeforeDays: "3",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Recurring Invoice Setup Saved!");
  };

  return (
    <Card className="p-4">
      <h4 className="mb-4">🔁 Invoice Recurring Setup</h4>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder="Enter customer name or ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Platform</Form.Label>
              <Form.Select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="BBSCART">BBSCART</option>
                <option value="Golddex">Golddex</option>
                <option value="DeliveryApp">Delivery App</option>
                <option value="Emerjobs">Emerjobs</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product/Service</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product or service"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.noEndDate}
              />
              <Form.Check
                type="checkbox"
                label="No End Date"
                name="noEndDate"
                checked={formData.noEndDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Frequency</Form.Label>
              <Form.Select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
                <option>Custom</option>
              </Form.Select>
              {formData.frequency === "Custom" && (
                <Form.Control
                  type="text"
                  className="mt-2"
                  name="customFreq"
                  placeholder="Enter custom frequency (e.g. every 10 days)"
                  onChange={handleChange}
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Next Invoice Date</Form.Label>
              <Form.Control
                type="date"
                name="nextInvoiceDate"
                value={formData.nextInvoiceDate}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Invoice Template</Form.Label>
              <Form.Control
                type="text"
                name="template"
                value={formData.template}
                onChange={handleChange}
                placeholder="Template name or ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option>INR</option>
                <option>USD</option>
                <option>AED</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tax Type</Form.Label>
              <Form.Select
                name="taxType"
                value={formData.taxType}
                onChange={handleChange}
              >
                <option>GST</option>
                <option>VAT</option>
                <option>Non-Taxable</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Check
              type="switch"
              label="Auto Email Invoices"
              name="autoEmail"
              checked={formData.autoEmail}
              onChange={handleChange}
            />
            <Form.Check
              type="switch"
              label="Auto WhatsApp Invoices"
              name="autoWhatsApp"
              checked={formData.autoWhatsApp}
              onChange={handleChange}
            />
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Reminder Before (days)</Form.Label>
              <Form.Control
                type="number"
                name="reminderBeforeDays"
                value={formData.reminderBeforeDays}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional instructions..."
          />
        </Form.Group>

        <div className="d-flex gap-3 mt-4">
          <Button variant="primary" type="submit">
            💾 Save Setup
          </Button>
          <Button variant="secondary">🔁 Preview Next Cycle</Button>
          <Button variant="outline-info">📤 Export</Button>
        </div>
      </Form>
    </Card>
  );
};

export default InvoiceRecurringSetup;
