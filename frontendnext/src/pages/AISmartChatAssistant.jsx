import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AISmartChatAssistant.css"; // Importing CSS

const AISmartChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessage = { sender: "User", text: userInput };
    setMessages([...messages, newMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/ai-smart-chat", { message: userInput });
      setMessages([...messages, newMessage, { sender: "AI", text: response.data.reply }]);
    } catch (err) {
      setError("Failed to get response from AI Chat Assistant.");
    }
    setLoading(false);
  };

  return (
    <div className="ai-smart-chat-container">
      <Sidebar />
      <Container fluid className="ai-smart-chat-content">
        <h2 className="ai-smart-chat-title">💬 AI Smart Chat Assistant</h2>

        {/* Chat Display */}
        <div className="chat-box">
          {messages.map((msg, index) => (
            <Card key={index} className={`chat-message ${msg.sender === "User" ? "user-message" : "ai-message"}`}>
              <Card.Body>{msg.text}</Card.Body>
            </Card>
          ))}
        </div>

        {/* Chat Input */}
        <Form className="chat-input">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button variant="primary" onClick={handleSendMessage}>Send</Button>
        </Form>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
      <style>
        {`
        .ai-smart-chat-container {
  display: flex;
  height: 100vh;
}

.ai-smart-chat-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-smart-chat-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.chat-box {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  margin-bottom: 10px;
}

.chat-message {
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 10px;
  max-width: 70%;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.ai-message {
  align-self: flex-start;
  background-color: #28a745;
  color: white;
}

.chat-input {
  display: flex;
  gap: 10px;
}
`}
      </style>
    </div>
  );
};

export default AISmartChatAssistant;
