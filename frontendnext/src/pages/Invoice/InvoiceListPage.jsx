// File: InvoiceListPage.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Form, Spinner,Card } from "react-bootstrap";
import { Link } from "react-router-dom"; // or next/link if using Next.js
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const InvoiceListPage = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  // const [filters, setFilters] = useState({
  //   platform: "All",
  //   status: "All",
  //   search: "",
  // });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;
  // Advanced filter state
  const [filters, setFilters] = useState({
    invoiceId: "",
    customer: "",
    gstin: "",
    platform: "All",
    role: "All",
    paymentStatus: "All",
    fromDate: "",
    toDate: "",
    invoiceType: "All",
    gstType: "All",
    gstSlab: "All",
    paymentMethod: "All",
  });
  const navigate = useNavigate(); // Using the useNavigate hook
  // Fetch invoices
  const fetchInvoices = () => {
    setLoading(true);
    const qs = new URLSearchParams();
     Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'All') qs.set(k, v);
     });
      fetch(`/api/invoices?${qs.toString()}`)
      .then(r => r.json())
       .then(({ success, invoices }) => {
          if (!success) throw new Error('Failed to load');
          setAllInvoices(invoices);
         setFiltered(invoices);
        })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  };
  
  useEffect(fetchInvoices, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchInvoices();
  };

  const resetFilters = () => {
    setFilters({
      invoiceId: "",
      customer: "",
      gstin: "",
      platform: "All",
      role: "All",
      paymentStatus: "All",
      fromDate: "",
      toDate: "",
      invoiceType: "All",
      gstType: "All",
      gstSlab: "All",
      paymentMethod: "All",
    });
    setPage(1);
    fetchInvoices();
  };
  const exportCSV = () => {
    const header = [
      "Invoice ID",
      "Customer",
      "Platform",
      "Invoice Date",
      "Due Date",
      "Total",
      "Paid",
      "Status",
      "Type",
      "Payment",
      "GST Type",
      "CGST",
      "SGST",
      "IGST",
      "Buyer GSTIN",
      "Buyer State",
      "Seller Name",
      "Seller GSTIN",
      "Seller State",
      "Item Name",
      "HSN",
      "Notes",
      "Use Escrow",
      "Partial Payment",
      "Sub Total",
      "Grand Total",
      "GST Total",
      "Notes",
    ];
    const rows = filtered.map((i) => {
      const paid = i.amountPaid || 0;
      const total = i.finalPayable || 0;
      const status = paid === 0 ? "Unpaid" : paid >= total ? "Paid" : "Partial";
      const items = (i.items || []).map((it) => it.itemName).join(",");
      const hsns = (i.items || []).map((it) => it.hsn).join(",");
      return [
        i.invoiceNumber,
        i.buyerName,
        i.platform,
        new Date(i.invoiceDate).toLocaleDateString(),
        i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "",
        total,
        paid,
        status,
        i.invoiceType,
        i.paymentMode,
        i.gstType,
        i.globalCGST,
        i.globalSGST,
        i.globalIGST,
        i.buyerGSTIN,
        i.buyerState,
        i.sellerName,
        i.sellerGSTIN,
        i.sellerState,
        items,
        hsns,
        i.notes,
        i.useEscrow ? "Yes" : "No",
        i.partialPayment ? "Yes" : "No",
        i.subtotal,
        i.grandTotal,
        i.totalGST,
        i.terms,
      ];
    });

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pagination:
  const total = filtered.length;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const slice = filtered.slice(from - 1, to);

  return (
    <div
      className="table-responsive"
      style={{ maxHeight: "700px", overflowY: "auto" }}
    >
      {" "}
      <h3 className="mb-3">Invoice List</h3>
      {/* Top Buttons */}
      <Row className="mb-3">
        <Col xs="auto">
          <Link to="/create-invoice">
            <Button variant="success">+ Create Invoice</Button>
          </Link>
        </Col>
        <Col xs="auto">
          {/* <Button variant="secondary" onClick={exportCSV}>
            Export
          </Button> */}
          <Button
            variant="secondary"
            onClick={() => navigate("/invoice-downloadOptions")}
          >
            Export
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="light" onClick={fetchInvoices}>
            Refresh
          </Button>
        </Col>
      </Row>
      {/* Advanced Filter Panel */}
      <Card className="mb-3">
        <Card.Header
          onClick={() => {
            /* optionally toggle collapse */
          }}
          style={{ cursor: "pointer", background: "#e9f2ff" }}
        >
          🔍 Advanced Invoice Filters
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="g-2">
              {[
                ["invoiceId", "Invoice ID", "text"],
                ["customer", "Customer Name / Mobile", "text"],
                ["gstin", "GSTIN", "text"],
              ].map(([name, label, type], i) => (
                <Col md={4} key={name}>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      name={name}
                      type={type}
                      value={filters[name]}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
              ))}

              {[
                [
                  "platform",
                  "Platform",
                  ["All", "BBSCART", "Golddex", "EmerJobs", "Thiaworld"],
                ],
                ["role", "Role", ["All", "Admin", "Vendor", "Agent"]],
                [
                  "paymentStatus",
                  "Payment Status",
                  ["All", "Paid", "Partial", "Unpaid"],
                ],
              ].map(([name, label, opts]) => (
                <Col md={4} key={name}>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                      name={name}
                      value={filters[name]}
                      onChange={handleFilterChange}
                    >
                      {opts.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              ))}

              <Col md={4}>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>

              {[
                ["invoiceType", "Invoice Type", ["All", "Manual", "Auto"]],
                ["gstType", "GST Type", ["All", "Intra-State", "Inter-State"]],
                [
                  "gstSlab",
                  "GST Slab",
                  ["All", "0%", "2.5%", "5%", "12%", "18%", "28%"],
                ],
                [
                  "paymentMethod",
                  "Payment Method",
                  ["All", "Cash", "Bank", "Wallet", "UPI", "NEFT/RTGS"],
                ],
              ].map(([name, label, opts]) => (
                <Col md={3} key={name}>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                      name={name}
                      value={filters[name]}
                      onChange={handleFilterChange}
                    >
                      {opts.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              ))}

              <Col md={2} className="d-grid align-self-end">
                <Button onClick={resetFilters} variant="secondary">
                  Reset
                </Button>
              </Col>
              <Col md={2} className="d-grid align-self-end">
                <Button onClick={applyFilters} variant="primary">
                  Apply Filters
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      {/* Filters */}
      <Form className="mb-3">
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Platform</Form.Label>
              <Form.Select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
              >
                <option>All</option>
                <option>BBSCART</option>
                <option>Golddex</option>
                <option>EmerJobs</option>
                <option>Thiaworld</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option>All</option>
                <option>Paid</option>
                <option>Partial</option>
                <option>Unpaid</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                name="search"
                type="text"
                placeholder="INV ID / Customer"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-grid">
            <Button variant="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="secondary" onClick={resetFilters} className="mt-1">
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
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
                <th>GST Type</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Buyer GSTIN</th>
                <th>Buyer State</th>
                <th>Seller Name</th>
                <th>Seller GSTIN</th>
                <th>Seller State</th>
                <th>Item Name</th>
                <th className="d-none d-lg-table-cell">HSN</th>
                <th>Notes</th>
                <th>Use Escrow</th>
                <th>Partial Payment</th>
                <th>Sub Total</th>
                <th>Grand Total</th>
                <th>GST Total</th>
                <th>Terms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((i, idx) => {
                const paid = i.amountPaid || 0;
                const totalPay = i.finalPayable || 0;
                const status =
                  paid === 0 ? "Unpaid" : paid >= totalPay ? "Paid" : "Partial";
                const items = (i.items || []).map((x) => x.itemName).join(", ");
                const hsns = (i.items || []).map((x) => x.hsn).join(", ");

                return (
                  <tr key={i._id}>
                    <td>{from + idx}</td>
                    <td>{i.invoiceNumber}</td>
                    <td>{i.buyerName}</td>
                    <td>{i.platform}</td>
                    <td>{new Date(i.invoiceDate).toLocaleDateString()}</td>
                    <td>
                      {i.dueDate
                        ? new Date(i.dueDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td>{totalPay}</td>
                    <td>{paid}</td>
                    <td>{status}</td>
                    <td>{i.invoiceType}</td>
                    <td>{i.paymentMode}</td>
                    <td>{i.gstType}</td>
                    <td>{i.globalCGST}</td>
                    <td>{i.globalSGST}</td>
                    <td>{i.globalIGST}</td>
                    <td>{i.buyerGSTIN}</td>
                    <td>{i.buyerState}</td>
                    <td>{i.sellerName}</td>
                    <td>{i.sellerGSTIN}</td>
                    <td>{i.sellerState}</td>
                    <td>{items}</td>
                    <td>{hsns}</td>
                    <td className="text-truncate" style={{ maxWidth: "120px" }}>
                      {i.notes}
                    </td>
                    <td>{i.useEscrow ? "Yes" : "No"}</td>
                    <td>{i.partialPayment ? "Yes" : "No"}</td>
                    <td>{i.subtotal}</td>
                    <td>{i.grandTotal}</td>
                    <td>{i.totalGST}</td>
                    <td>{i.terms}</td>
                    <td>
                      <td className="d-flex gap-1 flex-wrap">
                        <Link to={`/invoice-edit/${i._id}`}>
                          <Button variant="primary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/invoice-details/${i._id}`}>
                          <Button variant="outline-primary" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button variant="outline-dark" size="sm">
                          Print
                        </Button>
                      </td>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Pagination */}
          <Row className="align-items-center">
            <Col>
              Showing {from} to {to} of {total} invoices
            </Col>
            <Col className="text-end">
              <Button
                variant="light"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>{" "}
              <Button
                variant="light"
                size="sm"
                disabled={page >= Math.ceil(total / perPage)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default InvoiceListPage;
