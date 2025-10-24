import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Row,
  Col,
  Table,
  Button,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const InvoiceSmartMergePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [mergeTitle, setMergeTitle] = useState("");
  const [mergeType, setMergeType] = useState("Customer-wise");
  const [discount, setDiscount] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const navigate = useNavigate();

  // Load all invoices for selection
  useEffect(() => {
    axios.get("/api/invoices")
       .then(res => {
        // if your API responds { invoices: [ … ], total: 123 }
        const payload = res.data;
         if (Array.isArray(payload)) {
           setInvoices(payload);
         } else if (Array.isArray(payload.invoices)) {
            setInvoices(payload.invoices);
          } else {
            console.error("unexpected invoices response", payload);
            setInvoices([]);
          }
        })
      .catch(err => {
        console.error("couldn't load invoices", err);
         setInvoices([]);
      });
  }, []);

  const toggleSelect = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handlePreview = async () => {
    if (selected.size < 2) {
      return alert("Pick at least 2 invoices to merge.");
    }
    const body = {
      invoiceIds: Array.from(selected),
      mergeType,
      discount: parseFloat(discount) || 0,
      serviceFee: parseFloat(serviceFee) || 0,
    };
    const { data } = await axios.post("/api/invoices/merge/preview", body);
    // Navigate to a preview route, passing merged data in state
    navigate("/invoice-mergePreview");

    // navigate.push({
    //   pathname: "/invoice-mergePreview",
    //   query: { data: JSON.stringify(data) },
    // });
  };

  const handleSave = async () => {
    if (!mergeTitle) {
      return alert("Give your merged invoice a title.");
    }
    const body = {
      title: mergeTitle,
      invoiceIds: Array.from(selected),
      mergeType,
      discount: parseFloat(discount) || 0,
      serviceFee: parseFloat(serviceFee) || 0,
    };
    const { data } = await axios.post("/api/invoices/merge", body);
    alert(`Merged invoice created: ${data.invoiceNumber}`);
    navigate("/invoice-list");
  };

  return (
    <Container className="py-4">
      <h3>Invoice Smart Merge</h3>

      <Form className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Merge Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., March Orders"
                value={mergeTitle}
                onChange={(e) => setMergeTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Merge Type</Form.Label>
              <Form.Select
                value={mergeType}
                onChange={(e) => setMergeType(e.target.value)}
              >
                <option>Customer-wise</option>
                <option>Date-wise</option>
                <option>Platform-wise</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Apply Discount (₹ or %)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Service Fee (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={serviceFee}
                onChange={(e) => setServiceFee(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Table bordered hover responsive>
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
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={selected.has(inv._id)}
                  onChange={() => toggleSelect(inv._id)}
                />
              </td>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.buyerName}</td>
              <td>{inv.platform}</td>
              <td>₹{inv.grandTotal.toFixed(2)}</td>
              {/* <td>{inv.statusTracker.slice(-1)[0].action}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="primary" onClick={handlePreview}>
          Preview Merge
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save Merged Invoice
        </Button>
      </div>
    </Container>
  );
};

export default InvoiceSmartMergePage;
