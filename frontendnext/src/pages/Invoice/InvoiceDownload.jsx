// InvoiceDownload.jsx (Page 7 of 18)
import React, { useState } from "react";
import { Button, Form, Row, Col, Card, Table, Spinner } from "react-bootstrap";

const InvoiceDownload = () => {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [includeGST, setIncludeGST] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(false);
  const [includeSecurePlan, setIncludeSecurePlan] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const dummyInvoices = [
    {
      id: "INV001",
      customer: "John Doe",
      platform: "BBSCART",
      amount: "₹12,340",
      status: "PAID",
    },
    {
      id: "INV002",
      customer: "Jane Smith",
      platform: "Golddex",
      amount: "₹7,590",
      status: "PARTIAL",
    },
    {
      id: "INV003",
      customer: "Amit Kumar",
      platform: "Delivery",
      amount: "₹2,990",
      status: "FAILED",
    },
  ];

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      alert(
        `Exported ${
          selectedInvoices.length || dummyInvoices.length
        } invoices as ${exportFormat.toUpperCase()}`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📤 Invoice Download & Export</h3>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Select Export Format</Form.Label>
                  <Form.Select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="csv">CSV</option>
                    <option value="print">Print Preview</option>
                    <option value="zip">ZIP (Bulk)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Check
                  type="checkbox"
                  label="Include GST Breakdown"
                  checked={includeGST}
                  onChange={() => setIncludeGST(!includeGST)}
                />
              </Col>
              <Col md={3}>
                <Form.Check
                  type="checkbox"
                  label="Include Secure Plan Info"
                  checked={includeSecurePlan}
                  onChange={() => setIncludeSecurePlan(!includeSecurePlan)}
                />
              </Col>
              <Col md={3}>
                <Form.Check
                  type="checkbox"
                  label="Add Terms & Conditions"
                  checked={includeTerms}
                  onChange={() => setIncludeTerms(!includeTerms)}
                />
              </Col>
            </Row>
            <Button variant="primary" onClick={handleExport} disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Export Selected"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>📦 Select Invoices to Export</Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
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
              {dummyInvoices.map((inv, idx) => (
                <tr key={inv.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      onChange={() => {
                        const updated = selectedInvoices.includes(inv.id)
                          ? selectedInvoices.filter((id) => id !== inv.id)
                          : [...selectedInvoices, inv.id];
                        setSelectedInvoices(updated);
                      }}
                      checked={selectedInvoices.includes(inv.id)}
                    />
                  </td>
                  <td>{inv.id}</td>
                  <td>{inv.customer}</td>
                  <td>{inv.platform}</td>
                  <td>{inv.amount}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        inv.status === "PAID"
                          ? "success"
                          : inv.status === "PARTIAL"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InvoiceDownload;
