import React, { useState } from "react";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutoReplyChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chatbot", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Error from chatbot." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-smart-chat-container">
      <Sidebar />
      <div className="ai-smart-chat-content">
        <Container className="ai-smart-chat">
          <h3>🤖 AI Auto-Reply Chatbot</h3>
          <div className="chat-window p-3 mb-3" style={{ height: "350px", width: "50%", overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex p-1 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start "}`}
              >
                <Card
                  className={`p-1 w-50 mb-2 ${msg.sender === "user" ? "bg-light" : "bg-success text-white"}`}
                  style={{ maxWidth: "70%" }}
                >
                  <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                </Card>
              </div>
            ))}
            {loading && <Spinner animation="border" size="sm" />}
          </div>
          <Form.Control
            type="text"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="input-group-autoreply"
          />
          <Button variant="primary" className="ai-smart-chat-btn mt-2" onClick={sendMessage}>
            Send
          </Button>
        </Container>
      </div>

      <style>
        {`
          .ai-smart-chat-container {
            display: flex;
            width: 100vw;
            height: 100vh;
          }
          .ai-smart-chat-content {
            padding: 7rem 20px;
            width: 100%;
            height: 100%;
          }
          .ai-smart-chat {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .ai-smart-chat h3 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .input-group-autoreply {
            width: 50%;
            padding: 5px;
            border-radius: 5px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .chat-window {
            border: 1px solid #ccc;
            padding: 50px;
            border-radius: 5px;
            overflow-y: scroll;
          }
          .ai-smart-chat-btn {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-self: center;
          }

          @media (max-width: 768px) {
            .ai-smart-chat-container {
              flex-direction: column;
            }
            .ai-smart-chat-content {
              padding: 7rem 20px;
              width: 100%;
              height: 100%;
            }
            .input-group-autoreply {
              width: 100%;
              padding: 5px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AIAutoReplyChatbot;
