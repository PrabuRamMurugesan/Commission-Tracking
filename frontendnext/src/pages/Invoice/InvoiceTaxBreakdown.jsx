// InvoiceTaxBreakdown.jsx — Page 11 of 18

import React, { useState } from "react";
import { Table, Button, Form, Row, Col, Modal, Alert } from "react-bootstrap";

const InvoiceTaxBreakdown = () => {
  const [taxRows, setTaxRows] = useState([
    {
      id: 1,
      taxType: "CGST",
      taxCategory: "Goods",
      hsn: "8523",
      gstSlab: "18%",
      taxableValue: 10000,
      taxAmount: 1800,
      jurisdiction: "Tamil Nadu",
      gstinSeller: "29ABCDE1234F1Z5",
      gstinBuyer: "33FGHIJ5678K2L1",
      reverseCharge: false,
      invoiceType: "Intra-State",
      notes: "Standard GST slab applied",
      platform: "BBSCART",
    },
  ]);

  const handleAddRow = () => {
    setTaxRows([
      ...taxRows,
      {
        id: taxRows.length + 1,
        taxType: "",
        taxCategory: "",
        hsn: "",
        gstSlab: "",
        taxableValue: "",
        taxAmount: "",
        jurisdiction: "",
        gstinSeller: "",
        gstinBuyer: "",
        reverseCharge: false,
        invoiceType: "",
        notes: "",
        platform: "",
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...taxRows];
    updated[index][field] = value;
    if (field === "taxableValue" || field === "gstSlab") {
      const slab = parseFloat(updated[index].gstSlab.replace("%", ""));
      const val = parseFloat(updated[index].taxableValue);
      if (!isNaN(slab) && !isNaN(val)) {
        updated[index].taxAmount = ((val * slab) / 100).toFixed(2);
      }
    }
    setTaxRows(updated);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">GST Tax Breakdown (Invoice-wise)</h4>

      <Button variant="success" onClick={handleAddRow} className="mb-3">
        ➕ Add Tax Row
      </Button>

      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Tax Type</th>
            <th>Category</th>
            <th>HSN/SAC</th>
            <th>GST %</th>
            <th>Taxable Value (₹)</th>
            <th>GST Amount (₹)</th>
            <th>Jurisdiction</th>
            <th>Seller GSTIN</th>
            <th>Buyer GSTIN</th>
            <th>Reverse Charge</th>
            <th>Invoice Type</th>
            <th>Platform</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxRows.map((row, i) => (
            <tr key={row.id}>
              <td>{i + 1}</td>
              <td>
                <Form.Select
                  value={row.taxType}
                  onChange={(e) =>
                    handleInputChange(i, "taxType", e.target.value)
                  }
                >
                  <option>CGST</option>
                  <option>SGST</option>
                  <option>IGST</option>
                  <option>Custom</option>
                  <option>Cess</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  value={row.taxCategory}
                  onChange={(e) =>
                    handleInputChange(i, "taxCategory", e.target.value)
                  }
                >
                  <option>Goods</option>
                  <option>Services</option>
                  <option>Combo</option>
                  <option>Exempt</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.hsn}
                  onChange={(e) => handleInputChange(i, "hsn", e.target.value)}
                />
              </td>
              <td>
                <Form.Select
                  value={row.gstSlab}
                  onChange={(e) =>
                    handleInputChange(i, "gstSlab", e.target.value)
                  }
                >
                  <option>0%</option>
                  <option>5%</option>
                  <option>12%</option>
                  <option>18%</option>
                  <option>28%</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.taxableValue}
                  onChange={(e) =>
                    handleInputChange(i, "taxableValue", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Control type="text" value={row.taxAmount} readOnly />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.jurisdiction}
                  onChange={(e) =>
                    handleInputChange(i, "jurisdiction", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.gstinSeller}
                  onChange={(e) =>
                    handleInputChange(i, "gstinSeller", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.gstinBuyer}
                  onChange={(e) =>
                    handleInputChange(i, "gstinBuyer", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Check
                  type="switch"
                  checked={row.reverseCharge}
                  onChange={(e) =>
                    handleInputChange(i, "reverseCharge", e.target.checked)
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.invoiceType}
                  onChange={(e) =>
                    handleInputChange(i, "invoiceType", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Select
                  value={row.platform}
                  onChange={(e) =>
                    handleInputChange(i, "platform", e.target.value)
                  }
                >
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>Delivery App</option>
                  <option>Emerjobs</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.notes}
                  onChange={(e) =>
                    handleInputChange(i, "notes", e.target.value)
                  }
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const updated = taxRows.filter((_, index) => index !== i);
                    setTaxRows(updated);
                  }}
                >
                  🗑
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex gap-3 mt-3">
        <Button variant="primary">📤 Export GST Breakdown</Button>
        <Button variant="secondary">🧠 AI Validate Entries</Button>
        <Button variant="info">🔍 GST Filing Assistant Sync</Button>
      </div>
    </div>
  );
};

export default InvoiceTaxBreakdown;
