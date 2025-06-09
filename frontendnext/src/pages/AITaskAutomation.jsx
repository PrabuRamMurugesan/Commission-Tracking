import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AITaskAutomation.css"; // Importing CSS

const AITaskAutomation = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ name: "", type: "General", status: "Pending" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/ai-task-automation");
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load automated tasks.");
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post("/api/ai-task-automation", newTask);
      alert("New AI Task Created Successfully!");
      fetchTasks();
    } catch (err) {
      console.error("Error creating AI task:", err);
    }
  };

  return (
    <div className="ai-task-automation-container">
      <Sidebar />
      <Container fluid className="ai-task-automation-content">
        <h2 className="ai-task-automation-title">🤖 AI Task Automation</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Task Type</Form.Label>
            <Form.Select
              value={newTask.type}
              onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </Form.Select>
          </Form.Group>

          <Button variant="success" className="mt-2" onClick={handleCreateTask}>
            Create Task
          </Button>
        </Form>

        {/* Tasks Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="task-table mt-4">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.type}</td>
                  <td>
                    <span className={`task-status ${task.status.toLowerCase()}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-task-automation-container {
  display: flex;
  height: 100vh;
}

.ai-task-automation-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-task-automation-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.task-table th {
  background-color: #2c3e50;
  color: white;
  text-align: center;
}

.task-table td {
  text-align: center;
  padding: 10px;
}

.task-status.pending {
  color: orange;
  font-weight: bold;
}

.task-status.completed {
  color: green;
  font-weight: bold;
}

.task-status.failed {
  color: red;
  font-weight: bold;
}
`}
      </style>
    </div>
  );
};

export default AITaskAutomation;
