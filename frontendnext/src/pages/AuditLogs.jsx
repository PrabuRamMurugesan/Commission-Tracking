import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/AuditLogs.css"; // Import CSS

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionType, setActionType] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get("/api/audit-logs");
      setLogs(response.data);
      setFilteredLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setError("Failed to load audit log data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = logs;
    if (role) {
      filtered = filtered.filter(log => log.role === role);
    }
    if (actionType) {
      filtered = filtered.filter(log => log.action === actionType);
    }
    setFilteredLogs(filtered);
  };

  return (
    <div className="audit-logs-container">
      <h2 className="text-primary mb-4">📜 Audit Logs</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select User Role</option>
          <option value="Admin">Admin</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setActionType(e.target.value)}>
          <option value="">Select Action Type</option>
          <option value="Commission Update">Commission Update</option>
          <option value="Payout Adjustment">Payout Adjustment</option>
          <option value="User Role Change">User Role Change</option>
          <option value="Login Attempt">Login Attempt</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading audit logs...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.date).toLocaleString()}</td>
                <td>{log.user}</td>
                <td>{log.role}</td>
                <td>{log.action}</td>
                <td>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Audit Logs Styling */
.audit-logs-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select {
  width: 30%;
  padding: 10px;
  border-radius: 5px;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #e74c3c;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default AuditLogs;
