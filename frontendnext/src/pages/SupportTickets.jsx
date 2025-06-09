import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    try {
      const response = await axios.get("/api/support-tickets");
      const data = Array.isArray(response.data) ? response.data : []; // ✅ Always array
      setTickets(data);
      setFilteredTickets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      setError("Failed to load support tickets.");
      setTickets([]);           // ✅ Clear tickets
      setFilteredTickets([]);   // ✅ Clear filteredTickets
      setLoading(false);
    }
  };
  
  const handleFilter = () => {
    let filtered = tickets;
    if (status) {
      filtered = filtered.filter(ticket => ticket.status === status);
    }
    setFilteredTickets(filtered);
  };

  const handleAddTicket = async () => {
    try {
      await axios.post("/api/support-tickets/add", newTicket);
      alert("Support ticket submitted successfully!");
      setShow(false);
      fetchSupportTickets();
    } catch (error) {
      console.error("Error adding support ticket:", error);
      setError("Failed to submit ticket. Try again.");
    }
  };

  return (
   <div className="support-tickets-page">
    <Sidebar />
    <div className="support-tickets-container">
      <h2 className="text-primary mb-4">📩 Support Tickets</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
        <Button variant="success" onClick={() => setShow(true)}>New Ticket</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading tickets...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Date</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Status</th>
              <th>Raised By</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => (
              <tr key={index}>
                <td>{new Date(ticket.date).toLocaleString()}</td>
                <td>{ticket.ticketid}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.description}</td>
                <td>{ticket.status}</td>
                <td>{ticket.raiseby}</td>
                <td>{ticket.role}</td>
                <td>{ticket.action}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Support Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddTicket}>Submit</Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`
          .support-tickets-page {
          display: flex;
          height: 100vh;
          width: 100vw;
        }
          .support-tickets-container {
          width: 100%;
          padding: 7rem 20px;
        }
          .filters{
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
          .filters select {
          width: 70%;
          padding: 10px;
          border-radius: 5px;
          }

          .filters button {
          width: 10%;
          padding: 10px;
          border-radius: 5px;
          }

         @media (max-width: 768px) {
         .filters{
         display: flex;
         flex-direction: column;
         align-items: center;
         row-gap: 10px;
         }
         .filters button{
          width: fit-content;}     
         }

          
`}
      </style>
    </div>

   </div>
  );
};

export default SupportTickets;
