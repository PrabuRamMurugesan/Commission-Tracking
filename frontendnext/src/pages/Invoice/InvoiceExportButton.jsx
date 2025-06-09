// InvoiceExportButton.jsx (Page 13 of 18)

import React, { useState } from "react";
import { Button, Dropdown, Form, Modal, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const dummyInvoices = [
  { id: 1, customer: "John Doe", amount: 5000, status: "Paid", gst: 18 },
  { id: 2, customer: "Jane Smith", amount: 2000, status: "Unpaid", gst: 5 },
  {
    id: 3,
    customer: "BBSCART Vendor",
    amount: 10000,
    status: "Escrow",
    gst: 12,
  },
];

const InvoiceExportButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [format, setFormat] = useState("pdf");
  const [includeGST, setIncludeGST] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [alert, setAlert] = useState("");

  const handleExport = () => {
    if (selectedInvoices.length === 0) {
      setAlert("No invoices selected for export.");
      return;
    }
    setAlert("");

    const dataToExport = dummyInvoices.filter((inv) =>
      selectedInvoices.includes(inv.id)
    );

    if (format === "pdf") {
      const doc = new jsPDF();
      dataToExport.forEach((inv, index) => {
        doc.text(`Invoice ID: ${inv.id}`, 10, 10 + index * 10);
        doc.text(`Customer: ${inv.customer}`, 10, 15 + index * 10);
        doc.text(`Amount: ₹${inv.amount}`, 10, 20 + index * 10);
        if (includeGST) doc.text(`GST: ${inv.gst}%`, 10, 25 + index * 10);
      });
      doc.save("invoices.pdf");
    }

    if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Invoices");
      XLSX.writeFile(wb, "invoices.xlsx");
    }

    if (format === "csv") {
      const csvRows = [
        ["ID", "Customer", "Amount", "Status", "GST"],
        ...dataToExport.map((i) => [
          i.id,
          i.customer,
          i.amount,
          i.status,
          i.gst,
        ]),
      ];
      const csvString = csvRows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoices.csv";
      link.click();
    }

    setShowModal(false);
  };

  const toggleSelectInvoice = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Export Invoices
      </Button>

      {alert && (
        <Alert variant="danger" className="mt-2">
          {alert}
        </Alert>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Export Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Invoices</Form.Label>
            {dummyInvoices.map((invoice) => (
              <Form.Check
                key={invoice.id}
                type="checkbox"
                label={`#${invoice.id} - ${invoice.customer} - ₹${invoice.amount}`}
                checked={selectedInvoices.includes(invoice.id)}
                onChange={() => toggleSelectInvoice(invoice.id)}
              />
            ))}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Export Format</Form.Label>
            <Form.Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
            </Form.Select>
          </Form.Group>

          <Form.Check
            className="mt-2"
            type="checkbox"
            label="Include GST Breakdown"
            checked={includeGST}
            onChange={(e) => setIncludeGST(e.target.checked)}
          />
          <Form.Check
            className="mt-1"
            type="checkbox"
            label="Include Summary Section"
            checked={includeSummary}
            onChange={(e) => setIncludeSummary(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleExport}>
            Export Now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoiceExportButton;
