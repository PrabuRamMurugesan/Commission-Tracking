import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIVoiceAssistant.css"; // Importing CSS

const AIVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      setError("Error processing voice input.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      fetchAIResponse();
    };
  }, []);

  const startListening = () => {
    setResponse("");
    setError("");
    recognition.start();
  };

  const fetchAIResponse = async () => {
    if (!transcript.trim()) return;
    try {
      const res = await axios.post("/api/ai-voice-assistant", { message: transcript });
      setResponse(res.data.reply);
    } catch (err) {
      setError("Failed to get AI response.");
    }
  };

  return (
    <div className="ai-voice-assistant-container">
      <Sidebar />
      <Container fluid className="ai-voice-assistant-content">
        <h2 className="ai-voice-assistant-title">🎙️ AI Voice Assistant</h2>

        <Card className="voice-card">
          <Card.Body>
            <h5>Press the button and speak...</h5>
            <Button variant="primary" onClick={startListening} disabled={isListening}>
              {isListening ? "Listening..." : "Start Voice Command"}
            </Button>
            <p className="transcript">{transcript}</p>
            {isListening && <Spinner animation="border" />}
          </Card.Body>
          {response && <Alert variant="success">🗣️ AI Response: {response}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
        </Card>
      </Container>
      <style>
        {`
        .ai-voice-assistant-container {
  display: flex;
  height: 100vh;
}

.ai-voice-assistant-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-voice-assistant-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.voice-card {
  max-width: 500px;
  margin: auto;
  text-align: center;
}

.transcript {
  margin-top: 15px;
  font-weight: bold;
  color: #333;
}
`}
      </style>
    </div>
  );
};

export default AIVoiceAssistant;
