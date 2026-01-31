import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
  Pagination,
  Toast,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer",
    status: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // To filter users by status
  const [roleFilter, setRoleFilter] = useState(""); // To filter users by role
  const [page, setPage] = useState(1); // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `/user?page=${page}&status=${statusFilter}&role=${roleFilter}`
      );
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Fetched data is not an array:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users", error);
      setUsers([]);
    }
  };

  const handleShow = (user = null) => {
    setEditUser(user);
    if (user) {
      // Map accountStatus to status for the form
      const status = user.accountStatus === "active" ? true : false;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Customer",
        status: status,
      });
    } else {
      setFormData({ name: "", email: "", role: "Customer", status: true });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const name = (formData.name || "").trim();
      const email = (formData.email || "").trim();
      if (!name || !email) {
        setToastMessage("Name and Email are required!");
        setShowToast(true);
        return;
      }

      const endpoint = editUser ? `/user/${editUser._id}` : "/user";
      const method = editUser ? "put" : "post";
      const payload = {
        name,
        email,
        role: formData.role || "Customer",
        status: formData.status,
      };

      await axiosInstance[method](endpoint, payload);

      fetchUsers();
      handleClose();
      setToastMessage(editUser ? "User updated successfully!" : "User created successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error saving user", error);
      const errorMessage = error.response?.data?.message || error.message || "Error saving user";
      setToastMessage(errorMessage);
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    console.log(id, "userID");

    try {
      await axiosInstance.delete(`/user/${id}`);
      fetchUsers();
      setToastMessage("User deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting user", error);
      setToastMessage("Error deleting user");
      setShowToast(true);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axiosInstance.post("/user/", {
        users: selectedUsers,
      });
      fetchUsers();
      setToastMessage("Users deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting users", error);
      setToastMessage("Error deleting users");
      setShowToast(true);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevState) =>
      prevState.includes(userId)
        ? prevState.filter((id) => id !== userId)
        : [...prevState, userId]
    );
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#userTable" });
    doc.save("user_data.pdf");
  };

  return (
    <div className="user-management-container">
      <Sidebar />
      <div className="user-management">
        <h2>User Management</h2>

        {/* Search Bar */}
        <div className="search-bar-users">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          {/* Status Filter */}
          <Form.Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="mb-3"
          >
            <option value="">Filter by Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Form.Select>

          {/* Role Filter */}
          <Form.Select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="mb-3"
          >
            <option value="">Filter by Role</option>
            <option value="Admin">Admin</option>
            <option value="Franchise">Franchise</option>
            <option value="Agent">Agent</option>
            <option value="Customer">Customer</option>
          </Form.Select>
        </div>
        <div className="add-user-button">
          <Button variant="primary" onClick={() => handleShow()}>
            Add New User
          </Button>

          {/* Bulk Actions */}
          <Button
            variant="danger"
            onClick={handleBulkDelete}
            disabled={selectedUsers.length === 0}
          >
            Delete Selected Users
          </Button>
        </div>
        {/* User Table */}
        <Table striped bordered hover id="userTable">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={() => {
                    if (selectedUsers.length === users.length) {
                      setSelectedUsers([]);
                    } else {
                      setSelectedUsers(users.map((user) => user._id));
                    }
                  }}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => {
                if (!searchQuery) return true; // Show all users if search is empty
                const searchLower = searchQuery.toLowerCase();
                const name = (user.name || "").toLowerCase();
                const email = (user.email || "").toLowerCase();
                const role = (user.role || "").toLowerCase();
                return name.includes(searchLower) || email.includes(searchLower) || role.includes(searchLower);
              })
              .map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td>{user.name || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.role || "-"}</td>
                  <td>{user.accountStatus === "active" ? "Active" : user.accountStatus === "inactive" ? "Inactive" : user.accountStatus || "Active"}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleShow(user)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <Pagination.Item
              key={pageNumber + 1}
              active={page === pageNumber + 1}
              onClick={() => handlePageChange(pageNumber + 1)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
        </Pagination>

        <div className="export-buttons">
          {/* Export to CSV */}
          <CSVLink data={users} filename="user_data.csv">
            <Button variant="success">Export to CSV</Button>
          </CSVLink>

          {/* Export to PDF */}
          <Button variant="info" onClick={exportToPDF}>
            Export to PDF
          </Button>
        </div>
        {/* User Modal for Add/Edit */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editUser ? "Edit User" : "Add New User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Franchise">Franchise</option>
                  <option value="Franchisee">Franchisee</option>
                  <option value="Agent">Agent</option>
                  <option value="Customer">Customer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Territory">Territory</option>
                  <option value="CBV">CBV</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="status"
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {/*
        KYC Status for CRMuserManagemenmt,CustomerBecomeVendor
         */}
        <div>
          <form>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">Upload</button>
            <select>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
          </form>
        </div>

        {/* Toast Notifications */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
      <style>
        {`
      .user-management-container {
      display: flex;
      width: 100vw;
      height: 100vh;
      }
      .user-management {
        width: 100%;
        height: 100%;
        padding: 7rem 20px;
        overflow: auto;
      }
        .search-bar-users{
          display: flex;
          justify-content: flex-end;
          column-gap: 1rem;
        }
          .add-user-button{
          display: flex;
          justify-content: center;
          padding: 1rem 0;
          gap: 1rem;
          }
          .export-buttons{
            display: flex;
            justify-content: space-between;
            gap: 1rem;
          }
         
      `}
      </style>
    </div>
  );
};

export default UserManagement;
