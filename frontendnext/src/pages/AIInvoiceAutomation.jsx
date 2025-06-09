import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/AIInvoiceAutomation.css"; // Importing CSS

const AIInvoiceAutomation = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    amount: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("/api/ai-invoice-automation");
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch invoices.");
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const response = await axios.post("/api/ai-invoice-automation", newInvoice);
      setInvoices([...invoices, response.data]);
      setNewInvoice({ customer: "", amount: "", dueDate: "" });
    } catch (err) {
      setError("Failed to create invoice.");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice Report", 20, 10);
    doc.autoTable({
      head: [["Invoice ID", "Customer", "Amount ($)", "Due Date", "Status"]],
      body: invoices.map((invoice) => [
        invoice.invoiceId,
        invoice.customer,
        invoice.amount,
        invoice.dueDate,
        invoice.status,
      ]),
    });
    doc.save("invoice-report.pdf");
  };

  return (
    <div className="ai-invoice-automation-container">
      <Sidebar />
      <Container fluid className="ai-invoice-automation-content">
        <h2 className="ai-invoice-automation-title">🧾 AI Invoice Automation</h2>

        {/* Invoice Creation Form */}
        <Card className="invoice-form-card">
          <Card.Body>
            <h5>Create New Invoice</h5>
            <Form>
              <Form.Group>
                <Form.Label>Customer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter customer name"
                  value={newInvoice.customer}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </Form.Group>
              <Button className="mt-3" variant="primary" onClick={handleCreateInvoice}>
                Generate Invoice
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Invoice List */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            <Button className="mb-3" variant="success" onClick={exportPDF}>
              Export PDF
            </Button>
            <Table striped bordered hover responsive className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Amount ($)</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={index}>
                    <td>{invoice.invoiceId}</td>
                    <td>{invoice.customer}</td>
                    <td>${invoice.amount}</td>
                    <td>{invoice.dueDate}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-invoice-automation-container {
  display: flex;
  height: 100vh;
}

.ai-invoice-automation-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-invoice-automation-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.invoice-form-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.invoice-table th {
  background-color: #27ae60;
  color: white;
  text-align: center;
}

.invoice-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIInvoiceAutomation;
