import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";

export default function InvoiceAuditLogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [fieldFilter, setFieldFilter] = useState("All");

  useEffect(() => {
    async function loadAudit() {
      try {
        const res = await fetch(`/api/invoices/${id}/audit`);
        const body = await res.json();
        if (!res.ok || !body.success) {
          throw new Error(body.error || "Failed to load audit");
        }
        setAudit(body.audit);
        setFiltered(body.audit);
      } catch (err) {
        console.error("Audit fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, [id]);

  const handleSearch = () => {
    let data = [...audit];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.action.toLowerCase().includes(term) ||
          (r.note && r.note.toLowerCase().includes(term))
      );
    }
    if (userFilter !== "All") {
      data = data.filter((r) => r.performedBy === userFilter);
    }
    if (fieldFilter !== "All") {
      data = data.filter((r) => r.field === fieldFilter);
    }
    setFiltered(data);
  };

  const handleReset = () => {
    setSearchTerm("");
    setUserFilter("All");
    setFieldFilter("All");
    setFiltered(audit);
  };

  const users = Array.from(new Set(audit.map((r) => r.performedBy))).filter(
    Boolean
  );
  const fields = Array.from(new Set(audit.map((r) => r.field))).filter(Boolean);

  return (
    <Container className="py-4">
      <h3 className="mb-4">Invoice Audit Trail</h3>
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" /> Loading…
        </div>
      )}
      {error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && !error && (
        <>
          <Card className="mb-3">
            <Card.Header>Search &amp; Filters</Card.Header>
            <Card.Body>
              <Form>
                <Row className="align-items-end g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Search by Action / Note</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search by action or note…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Filter by User</Form.Label>
                      <Form.Select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                      >
                        <option>All</option>
                        {users.map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Filter by Field</Form.Label>
                      <Form.Select
                        value={fieldFilter}
                        onChange={(e) => setFieldFilter(e.target.value)}
                      >
                        <option>All</option>
                        {fields.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-grid">
                    <Button variant="primary" onClick={handleSearch}>
                      Search
                    </Button>
                    <Button
                      variant="secondary"
                      className="mt-2"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Action</th>
                <th>Field Changed</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>User</th>
                <th>Timestamp</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-3">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.action}</td>
                    <td>{r.field || "—"}</td>
                    <td>{r.oldValue ?? "—"}</td>
                    <td>{r.newValue ?? "—"}</td>
                    <td>{r.performedBy}</td>
                    <td>
                      {new Date(r.timestamp).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{r.note || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
