import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const HierarchyManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      const response = await axios.get("/api/hierarchy-management");
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hierarchy data:", error);
      setError("Failed to load hierarchy data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!role) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.role === role);
      setFilteredUsers(Array.isArray(filtered) ? filtered : []);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hierarchy Management Report", 20, 10);
    doc.autoTable({
      head: [["User ID", "Name", "Role", "Parent ID"]],
      body: (Array.isArray(filteredUsers) ? filteredUsers : []).map(user => [
        user.userId,
        user.name,
        user.role,
        user.parentId
      ]),
    });
    doc.save("hierarchy-management.pdf");
  };

  return (
    <div className="page-wrapper">
    <Sidebar />
  
    <div className="hierarchy-management-container flex-grow-1">
      <h2 className="text-primary mb-4">🏗️ Hierarchy Management</h2>
  
      <div className="filters mb-3 d-flex flex-wrap gap-2">
        <Form.Select
          onChange={(e) => setRole(e.target.value)}
          className="me-2"
          style={{ minWidth: "200px", flex: "1 1 auto" }}
        >
          <option value="">Filter by Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="CustomerBecomeAVendor">CustomerBecomeAVendor</option>
          <option value="Referral">Referral</option>
        </Form.Select>
  
        <Button variant="primary" onClick={handleFilter}>
          Apply Filters
        </Button>
      </div>
  
      <div className="export-buttons mb-4 d-flex flex-wrap gap-2">
        <CSVLink
          data={Array.isArray(filteredUsers) ? filteredUsers : []}
          filename="hierarchy-management.csv"
          className="btn btn-success"
        >
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>
          Export PDF
        </Button>
      </div>
  
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading hierarchy data...</span>
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
              <th>Parent ID</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(filteredUsers) ? filteredUsers : []).map((user, index) => (
              <tr key={index}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.parentId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  
    <style>
      {`
        .page-wrapper {
          display: flex;
          flex-direction: row;
          background-color: #f1f3f5;
          width: 100vw;  
          height: 100vh;
        }
  
        .hierarchy-management-container {
          padding: 80px ;
          flex-grow: 1;
          background-color: #ffffff;  
         
        }
  
        @media (max-width: 768px) {
          .page-wrapper {
            flex-direction: column;
          
          }
  
          .hierarchy-management-container {
            padding:25%
          }
        }
      `}
    </style>
  </div>
    
  );
};

export default HierarchyManagement;
