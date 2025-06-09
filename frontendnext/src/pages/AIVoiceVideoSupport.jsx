import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import "../styles/AIVoiceVideoSupport.css"; // Importing CSS

const AIVoiceVideoSupport = () => {
  const [socket, setSocket] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const startCall = async () => {
    setCallActive(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection();
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    peerConnection.current.ontrack = event => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("offer", offer);
  };

  return (
    <div className="ai-voice-video-support-container">
      <Sidebar />
      <Container fluid className="ai-voice-video-support-content">
        <h2 className="ai-voice-video-support-title">📞 AI Voice & Video Support</h2>

        <Row>
          <Col md={6}>
            <Card className="video-card">
              <Card.Body>
                <h5>📹 Your Video</h5>
                <video ref={localVideoRef} autoPlay muted className="video-stream" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="video-card">
              <Card.Body>
                <h5>🎥 Customer Video</h5>
                <video ref={remoteVideoRef} autoPlay className="video-stream" />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button className="mt-4" variant="success" onClick={startCall} disabled={callActive}>
          Start Call
        </Button>
      </Container>
      <style>
        {`
        .ai-voice-video-support-container {
  display: flex;
  height: 100vh;
}

.ai-voice-video-support-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-voice-video-support-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.video-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.video-stream {
  width: 100%;
  border-radius: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIVoiceVideoSupport;
