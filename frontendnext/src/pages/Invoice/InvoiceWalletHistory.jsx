// File: InvoiceWalletHistory.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

export default function InvoiceWalletHistory() {
  const { invoiceId } = useParams();

  const [data, setData] = useState({ summary: {}, transactions: [] });
  const [filters, setFilters] = useState({
    search: "",
    platform: "All",
    type: "All",
    status: "All",
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(fetchHistory, []);
  function fetchHistory() {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    fetch(`/api/wallet-history?invoiceId=${invoiceId}`)
      .then((r) => r.json())
      .then(({ success, summary, transactions }) => {
        if (!success) throw new Error("Failed to load");
        console.log("Wallet history API returned:", data);

        setData({ summary, transactions });
      })
      .catch((err) => alert(err.message || "Server error"))
      .finally(() => setLoading(false));
  }

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchHistory();
  };
  const resetFilters = () => {
    setFilters({ search: "", platform: "All", type: "All", status: "All" });
    setPage(1);
    fetchHistory();
  };

  const exportCSV = () => {
    const header = [
      "Txn ID",
      "Date",
      "Invoice ID",
      "Escrow ID",
      "Platform",
      "Type",
      "Reason",
      "Amount",
      "Status",
      "Notes",
    ];
    const rows = data.transactions.map((tx) => [
      tx.txnId,
      new Date(tx.date).toLocaleDateString(),
      tx.invoiceId,
      tx.escrowId,
      tx.platform,
      tx.type,
      tx.reason,
      `₹${tx.amount}`,
      tx.status,
      tx.notes,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // pagination slice
  const total = data.transactions.length;
  const from = (page - 1) * perPage;
  const slice = data.transactions.slice(from, from + perPage);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3>Invoice Wallet History</h3>

      {/* Summary Cards */}
      <Row className="g-3 mb-3">
        {[
          {
            label: "Total Wallet Usage",
            value: `₹${data.summary.totalUsage || 0}`,
          },
          {
            label: "Escrow Linked",
            value: `₹${data.summary.escrowLinked || 0}`,
          },
          { label: "Refunded", value: `₹${data.summary.refunded || 0}` },
          { label: "Pending Actions", value: data.summary.pendingActions || 0 },
        ].map((c, i) => (
          <Col md={3} key={i}>
            <Card>
              <Card.Body>
                <Card.Title style={{ fontSize: "1rem" }}>{c.label}</Card.Title>
                <Card.Text style={{ fontSize: "1.25rem", fontWeight: "500" }}>
                  {c.value}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Form className="mb-3">
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <Form.Label>Search Txn ID / Invoice ID</Form.Label>
            <Form.Control
              name="search"
              value={filters.search}
              onChange={handleFilter}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Filter by Platform</Form.Label>
            <Form.Select
              name="platform"
              value={filters.platform}
              onChange={handleFilter}
            >
              <option>All</option>
              <option>BBSCART</option>
              <option>Golddex</option>
              <option>EmerJobs</option>
              <option>Thiaworld</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={filters.type}
              onChange={handleFilter}
            >
              <option>All</option>
              <option>Credit</option>
              <option>Debit</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilter}
            >
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
            </Form.Select>
          </Col>
          <Col md={2} className="d-grid">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="secondary" onClick={resetFilters} className="mt-1">
              Reset
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Export / Print Buttons */}
      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={exportCSV}>
            Export CSV
          </Button>{" "}
          <Button variant="secondary">Export PDF</Button>{" "}
          <Button variant="primary">Print Ledger</Button>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Date</th>
            <th>Invoice ID</th>
            <th>Escrow ID</th>
            <th>Platform</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((tx) => (
            <tr key={tx.txnId}>
              <td>{tx.txnId}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>
                <Link to={`/invoice-details/${tx.invoiceId}`}>
                  {tx.invoiceId}
                </Link>
              </td>
              <td>{tx.escrowId}</td>
              <td>
                <Badge bg="info">{tx.platform}</Badge>
              </td>
              <td>
                <Badge bg={tx.type === "Credit" ? "success" : "warning"}>
                  {tx.type}
                </Badge>
              </td>
              <td>{tx.reason}</td>
              <td>₹{tx.amount}</td>
              <td>
                <Badge bg={tx.status === "Completed" ? "success" : "warning"}>
                  {tx.status}
                </Badge>
              </td>
              <td>{tx.notes}</td>
              <td>
                <Link to={`/wallet-history/${tx.txnId}`}>
                  <Button size="sm">View</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Row className="align-items-center">
        <Col>
          Showing {from + 1} to {Math.min(from + perPage, total)} of {total}{" "}
          transactions
        </Col>
        <Col className="text-end">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>{" "}
          <Button
            disabled={page * perPage >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
