import React, { useRef, useState } from "react";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import "../styles/AIVideoCallSupport.css"; // Importing CSS

const AIVideoCallSupport = () => {
  const [error, setError] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let peerConnection;

  const startCall = async () => {
    setError("");
    setIsCalling(true);

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;

      peerConnection = new RTCPeerConnection();
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send offer to backend server to connect with customer support agent
      const response = await fetch("/api/ai-video-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer }),
      });

      const data = await response.json();
      if (data.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (err) {
      setError("Failed to start video call. Please check your camera and microphone.");
      setIsCalling(false);
    }
  };

  return (
    <div className="ai-video-call-container">
      <Sidebar />
      <Container fluid className="ai-video-call-content">
        <h2 className="ai-video-call-title">📹 AI Video Call Support</h2>

        <Card className="video-call-card">
          <Card.Body className="video-call-body">
            <div className="video-container">
              <video ref={localVideoRef} autoPlay muted className="video-stream" />
              <video ref={remoteVideoRef} autoPlay className="video-stream" />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {!isCalling ? (
              <Button variant="primary" onClick={startCall}>
                Start Video Call
              </Button>
            ) : (
              <Spinner animation="border" />
            )}
          </Card.Body>
        </Card>
      </Container>
      <style>
        {`
        .ai-video-call-container {
  display: flex;
  height: 100vh;
}

.ai-video-call-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-video-call-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.video-call-card {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.video-call-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.video-stream {
  width: 250px;
  height: 180px;
  border-radius: 10px;
  border: 2px solid #007bff;
}
`}
      </style>
    </div>
  );
};

export default AIVideoCallSupport;
