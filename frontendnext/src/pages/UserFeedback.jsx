import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [show, setShow] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newFeedback, setNewFeedback] = useState({
    category: "",
    message: "",
    rating: 3,
    anonymous: false,
  });

  useEffect(() => {
    fetchUserFeedback();
    const interval = setInterval(fetchUserFeedback, 30000); // 30 seconds auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fetchUserFeedback = async () => {
    try {
      // const response = await axios.get("/api/user-feedback");
      const response = { data: [] }; // Dummy data if API is not available for testing
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data); // Ensure it's always an array
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      setError("Failed to load user feedback.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = [...feedbacks];

    if (status) {
      filtered = filtered.filter((f) => f.status === status);
    }

    if (categoryFilter) {
      filtered = filtered.filter((f) => f.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((f) =>
        f.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (fromDate) {
      filtered = filtered.filter((f) => new Date(f.date) >= new Date(fromDate));
    }

    if (toDate) {
      filtered = filtered.filter((f) => new Date(f.date) <= new Date(toDate));
    }

    setFilteredFeedbacks(filtered);
  };

  const handleAddFeedback = async () => {
    try {
      await axios.post("/api/user-feedback/add", newFeedback);
      toast.success("Feedback submitted successfully!");
      setShow(false);
      fetchUserFeedback();
    } catch (error) {
      console.error("Error adding feedback:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/user-feedback/${id}/update-status`, {
        status: newStatus,
      });
      toast.success("Status updated!");
      fetchUserFeedback();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleReplySubmit = async () => {
    try {
      await axios.patch(`/api/user-feedback/${selectedFeedback._id}/reply`, {
        reply: replyMessage,
      });
      toast.success("Reply sent!");
      setReplyModal(false);
      fetchUserFeedback();
    } catch (error) {
      toast.error("Failed to send reply.");
    }
  };

  return (
    <div className="user-feedback-page">
      <Sidebar />
      <div className="user-feedback-container">
        <h2 className="text-primary mb-4">📝 User Feedback System</h2>

        <div className="filter ">
          <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
          </Form.Control>

          <Form.Control
            as="select"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Commission">Commission</option>
            <option value="Payout">Payout</option>
            <option value="System">System Issue</option>
            <option value="Other">Other</option>
          </Form.Control>

          <Form.Control
            type="text"
            placeholder="Search message..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Form.Control
            type="date"
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Form.Control
            type="date"
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="button-container">
        <Button onClick={handleFilter} variant="primary">
            Apply Filters
          </Button>

          <Button variant="success" onClick={() => setShow(true)}>
            Submit Feedback
          </Button>
          <CSVLink data={feedbacks} filename="user_feedback.csv">
            <Button variant="info">Download CSV</Button>
          </CSVLink>
        </div>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="bg-warning text-white">
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Message</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Reply</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredFeedbacks) &&
              filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback, index) => (
                  <tr key={index}>
                    <td>{new Date(feedback.date).toLocaleString()}</td>
                    <td>{feedback.category}</td>
                    <td>{feedback.message}</td>
                    <td>{feedback.rating}⭐</td>
                    <td>
                      <Form.Select
                        value={feedback.status}
                        onChange={(e) =>
                          updateStatus(feedback._id, e.target.value)
                        }
                      >
                        <option>Pending</option>
                        <option>Reviewed</option>
                        <option>Resolved</option>
                      </Form.Select>
                    </td>
                    <td>{feedback.reply || "No Reply Yet"}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setReplyModal(true);
                          setSelectedFeedback(feedback);
                        }}
                      >
                        Reply
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No feedback available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Modal for submitting feedback */}
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Commission">Commission</option>
                  <option value="Payout">Payout</option>
                  <option value="System">System Issue</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, message: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Rating (1-5)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, rating: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Submit Anonymously"
                  onChange={(e) =>
                    setNewFeedback({
                      ...newFeedback,
                      anonymous: e.target.checked,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddFeedback}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for replying to feedback */}
        <Modal show={replyModal} onHide={() => setReplyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reply to Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={3}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setReplyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReplySubmit}>
              Send Reply
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer />
      </div>
      <style>{`
    .user-feedback-page{
    display: flex;
    width: 100vw;
    height: 100vh;
    }
    .user-feedback-container{
    width: 100%;
    height: 100%;
    padding: 7% 30px;
    }
    .filter{
    display: flex;
    flex-direction: row;
   
    gap: 20px;
    margin-bottom: 20px;
    }
    .filter <.option{
    background-color: black;
    color: white;
    }
    .button-container{
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-bottom: 20px;
    justify-content: end;}
 @media (max-width: 768px) {
      .user-feedback-container{
        padding: 8rem 20px;
      }

      .filter{
        flex-direction: column;
      }
        .button-container{
        justify-content: center;
      }
    }
    `}</style>
    </div>
  );
};

export default UserFeedback;
