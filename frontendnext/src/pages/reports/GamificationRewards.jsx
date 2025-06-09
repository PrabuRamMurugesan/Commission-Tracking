//Leaderboard & Badge Tracking
import React, { useEffect, useState } from "react";
import { Table, Badge, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const GamificationRewards = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/leaderboard");
      setLeaders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard data.");
      setLoading(false);
    }
  };

  return (
    <div className="gamification-rewards">
      <h2 className="text-primary mb-4">🏆 Top Performers & Rewards</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading leaderboard...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="leaderboard-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Sales ($)</th>
                  <th>Commission ($)</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{leader.name}</td>
                    <td>${leader.sales}</td>
                    <td>${leader.commission}</td>
                    <td>
                      <Badge bg={index === 0 ? "warning" : index === 1 ? "secondary" : "success"}>
                        {index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <style>
        {`
        .gamification-rewards {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.leaderboard-card {
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.badge-warning {
  background-color: #ffd700 !important;
  color: black !important;
}

.badge-secondary {
  background-color: #c0c0c0 !important;
  color: black !important;
}

.badge-success {
  background-color: #cd7f32 !important;
  color: white !important;
}
`}
      </style>
    </div>
  );
};

export default GamificationRewards;
