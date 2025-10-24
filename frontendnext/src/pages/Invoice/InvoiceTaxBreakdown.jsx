// File: InvoiceTaxBreakdown.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Badge,
} from "react-bootstrap";

export default function InvoiceTaxBreakdown() {
  const { invoiceId } = useParams();
  console.log("Param from URL:", useParams());
  console.log("invoiceId", useParams());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing rows
  useEffect(() => {
    fetch(`/api/invoice-taxBreakdown?invoiceId=${invoiceId}`)
      .then((r) => r.json())
      .then(({ success, rows }) => {
        if (!success) throw new Error("Failed to load");
        setRows(rows);
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, [invoiceId]);

  // Add a blank row
  const addRow = () => {
    fetch("/api/invoice-taxBreakdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId }),
    })
      .then((r) => r.json())
      .then(({ success, row }) => {
        if (!success) throw new Error("Failed to create");
        setRows((rs) => [...rs, row]);
      })
      .catch((err) => alert(err.message));
  };

  // Update a field
  const updateField = (id, field, value) => {
    fetch(`/api/invoice-taxBreakdown/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    })
      .then((r) => r.json())
      .then(({ success, row }) => {
        if (!success) throw new Error("Update failed");
        setRows((rs) => rs.map((rw) => (rw._id === id ? row : rw)));
      })
      .catch((err) => console.error(err));
  };

  // Delete a row
  const deleteRow = (id) => {
    if (!window.confirm("Delete this row?")) return;
    fetch(`/api/invoice-taxBreakdown/${invoiceId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then(({ success }) => {
        if (success) {
          setRows((rs) => rs.filter((rw) => rw.invoiceId !== invoiceId));
        }
      });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3>GST Tax Breakdown (Invoice-wise)</h3>
      <div className="mb-3">
        <Link to={`/invoice-details/${invoiceId}`}>
          <Button variant="secondary">‹ Back to Invoice</Button>
        </Link>
        <Button variant="success" onClick={addRow}>
          + Add Tax Row
        </Button>
        <Link to={`/invoice-statusTracker/${invoiceId}`}>
          <Button variant="secondary">Invoice Status Tracker</Button>
        </Link>
      </div>

      <Table bordered responsive>
        <thead>
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
          {rows.map((r, i) => (
            <tr key={r._id}>
              <td>{i + 1}</td>
              <td>
                <Form.Select
                  value={r.taxType}
                  onChange={(e) =>
                    updateField(r._id, "taxType", e.target.value)
                  }
                >
                  <option value="C">C</option>
                  <option value="S">S</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  value={r.category}
                  onChange={(e) =>
                    updateField(r._id, "category", e.target.value)
                  }
                >
                  <option>Goods</option>
                  <option>Services</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  value={r.hsnSac || ""}
                  onChange={(e) => updateField(r._id, "hsnSac", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={r.gstPercent || 0}
                  onChange={(e) =>
                    updateField(r._id, "gstPercent", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={r.taxableValue || 0}
                  onChange={(e) =>
                    updateField(
                      r._id,
                      "taxableValue",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={r.gstAmount || 0}
                  onChange={(e) =>
                    updateField(r._id, "gstAmount", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                <Form.Control
                  value={r.jurisdiction || ""}
                  onChange={(e) =>
                    updateField(r._id, "jurisdiction", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Control
                  value={r.sellerGSTIN || ""}
                  onChange={(e) =>
                    updateField(r._id, "sellerGSTIN", e.target.value)
                  }
                />
              </td>
              <td>
                <Form.Control
                  value={r.buyerGSTIN || ""}
                  onChange={(e) =>
                    updateField(r._id, "buyerGSTIN", e.target.value)
                  }
                />
              </td>
              <td className="text-center">
                <Form.Check
                  type="switch"
                  checked={r.reverseCharge}
                  onChange={(e) =>
                    updateField(r._id, "reverseCharge", e.target.checked)
                  }
                />
              </td>
              <td>
                <Form.Select
                  value={r.invoiceType}
                  onChange={(e) =>
                    updateField(r._id, "invoiceType", e.target.value)
                  }
                >
                  <option>Intra-State</option>
                  <option>Inter-State</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  value={r.platform}
                  onChange={(e) =>
                    updateField(r._id, "platform", e.target.value)
                  }
                >
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>EmerJobs</option>
                  <option>Thiaworld</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  value={r.notes || ""}
                  onChange={(e) => updateField(r._id, "notes", e.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteRow(r._id)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="mt-3">
        <Col>
          <Button variant="primary">Export GST Breakdown</Button>{" "}
          <Button variant="secondary">AI Validate Entries</Button>{" "}
          <Button variant="info">GST Filing Assistant Sync</Button>
        </Col>
      </Row>
    </Container>
  );
}
