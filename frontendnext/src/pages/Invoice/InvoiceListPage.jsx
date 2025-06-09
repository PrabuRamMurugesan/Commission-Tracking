// InvoiceListPage.jsx (Page 3 of 18) – Functional Version

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const rowsPerPage = 10;

const InvoiceListPage = () => {
const navigate = useNavigate();
const [invoices, setInvoices] = useState([]);
const [filteredInvoices, setFilteredInvoices] = useState([]);
const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(invoices.length / rowsPerPage);

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api/invoices");
        setInvoices(response.data.invoices);
        setFilteredInvoices(response.data.invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);
  const handleSearch = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(lowerSearch) ||
        inv.buyer?.name.toLowerCase().includes(lowerSearch)
    );
    setFilteredInvoices(filtered);
  };


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3">
        <Col md={6}>
          <h4>Invoice List</h4>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" className="me-2">
            + Create Invoice
          </Button>
          <Button variant="outline-primary" className="me-2">
            Export
          </Button>
          <Button variant="outline-dark">Refresh</Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>Filter Invoices</Card.Header>
        <Card.Body>
          <Row className="gy-2">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Platform</Form.Label>
                <Form.Select>
                  <option>All</option>
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>Delivery</option>
                  <option>Emerjobs</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select>
                  <option>All</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Partial</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="INV ID / Customer"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" className="me-2">
              Apply Filters
            </Button>
            <Button variant="secondary">Reset</Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>All Invoices</Card.Header>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Platform</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Type</th>
                <th>Payment</th>
                <th>GST</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((inv, idx) => (
                <tr key={inv._id}>
                  <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td>
                    <a href="#">{inv.invoiceNumber}</a>
                  </td>
                  <td>{inv.buyer?.name || "-"}</td>
                  <td>{inv.platform}</td>
                  <td>{inv.invoiceDate?.substring(0, 10)}</td>
                  <td>{inv.dueDate?.substring(0, 10) || "-"}</td>
                  <td>₹{inv.totalAmount || "0.00"}</td>
                  <td>₹{inv.payment?.amountPaid || "0.00"}</td>

                  <td>
                    <Badge
                      bg={
                        inv.status === "Paid"
                          ? "success"
                          : inv.status === "Unpaid"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </td>
                  <td>{inv.type || "-"}</td>
                  <td>{inv.payment?.mode || "-"}</td>
                  <td>{inv.items?.length > 0 ? inv.items[0].gstType : "-"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-1"
                      onClick={() => {
                        navigate(`/invoice-details?id=${inv._id}`);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="me-1"
                      onClick={() => {
                        navigate(`/invoice-edit?id=${inv._id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => {
                        window.print(); // Simple placeholder for now
                      }}
                    >
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination Controls */}
      <Row>
        <Col md={6}>
          <p className="text-muted">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, invoices.length)} of{" "}
            {invoices.length} invoices
          </p>
        </Col>
        <Col md={6} className="text-end">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            className="me-2"
          >
            Prev
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={i + 1 === currentPage ? "primary" : "outline-secondary"}
              onClick={() => handlePageChange(i + 1)}
              className="me-1"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default InvoiceListPage;
