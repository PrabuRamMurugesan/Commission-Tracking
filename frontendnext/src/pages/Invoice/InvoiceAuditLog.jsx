import React from "react";
import { Table, Badge, Form, Button } from "react-bootstrap";

const dummyLogs = [
  {
    id: 1,
    action: "Updated Payment Status",
    field: "Payment Status",
    oldValue: "Pending",
    newValue: "Completed",
    user: "Admin",
    timestamp: "2025-06-05 10:12:00",
    note: "Customer confirmed receipt",
  },
  {
    id: 2,
    action: "Modified Tax Breakdown",
    field: "CGST + SGST",
    oldValue: "5%",
    newValue: "9%",
    user: "Finance Head",
    timestamp: "2025-06-04 15:40:00",
    note: "Updated based on state revision",
  },
  {
    id: 3,
    action: "Escrow Hold Added",
    field: "Escrow Status",
    oldValue: "Not Applicable",
    newValue: "Held - Golddex",
    user: "Admin",
    timestamp: "2025-06-03 18:22:00",
    note: "Due to partial payment request",
  },
];

const InvoiceAuditLog = () => {
  return (
    <div className="container mt-4">
      <h4 className="mb-4">Invoice Audit Trail</h4>

      <Form className="mb-3 d-flex gap-3 flex-wrap">
        <Form.Control
          type="text"
          placeholder="Search by user, action, or field..."
        />
        <Form.Select>
          <option value="">Filter by User</option>
          <option>Admin</option>
          <option>Finance Head</option>
        </Form.Select>
        <Form.Select>
          <option value="">Filter by Field</option>
          <option>Payment Status</option>
          <option>CGST + SGST</option>
          <option>Escrow Status</option>
        </Form.Select>
        <Button variant="primary">Search</Button>
        <Button variant="outline-secondary">Reset</Button>
      </Form>

      <Table striped bordered hover responsive>
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
          {dummyLogs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
              <td>
                <Badge bg="info">{log.action}</Badge>
              </td>
              <td>{log.field}</td>
              <td>{log.oldValue}</td>
              <td>{log.newValue}</td>
              <td>{log.user}</td>
              <td>{log.timestamp}</td>
              <td>{log.note}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InvoiceAuditLog;
