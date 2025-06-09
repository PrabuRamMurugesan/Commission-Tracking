import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const UserRolesPermissions = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchRolesPermissions();
  }, []);

  const fetchRolesPermissions = async () => {
    try {
      // const response = await axios.get("/api/user-roles-permissions");
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles & permissions:", error);
      setError("Failed to load user roles & permissions.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = users;
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    setFilteredUsers(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Roles & Permissions Report", 20, 10);
    doc.autoTable({
      head: [["User ID", "Name", "Role", "Permissions"]],
      body: filteredUsers.map(user => [
        user.userId,
        user.name,
        user.role,
        user.permissions.join(", "),
      ]),
    });
    doc.save("user-roles-permissions.pdf");
  };

  return (
    <div className="user-roles-permissions">
      <Sidebar />
      <div className="user-roles-container">
      <h2 className="text-primary mb-4">🔑 User Roles & Permissions</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Filter by Role</option>
          <option value="Admin">Admin</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="CustomerBecomeAVendor">CustomerBecomeAVendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={filteredUsers} filename="user-roles-permissions.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading user roles data...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.permissions.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* User Roles & Permissions Styling */
.user-roles-permissions {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.user-roles-container {
  padding: 7% 20px;
  width: 100%;
  height: 100%;
}

.filters {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
}

.filters select {
  width: 30%;
  padding: 10px;
  border-radius: 5px;

}

.export-buttons {
  margin: 20px 0;
    display: flex;
  justify-content: center;
  gap: 10px;  
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

@media (max-width: 768px) {

  .user-roles-container {
    padding: 8rem 10px;
  }
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
    </div>
  );
};

export default UserRolesPermissions;
