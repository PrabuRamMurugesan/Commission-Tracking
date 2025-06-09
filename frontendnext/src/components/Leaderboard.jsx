//Gamification & Top Performers
import React, { useEffect, useState } from "react";
import { Table, Badge, Card } from "react-bootstrap";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/gamification/leaderboard");
      setLeaders(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <Card className="leaderboard-card">
      <Card.Body>
        <Card.Title>🏆 Top Performers</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Sales ($)</th>
              <th>Commission Earned ($)</th>
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
                  <Badge bg={index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}>
                    {index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <style>
        {`
        .leaderboard-card {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.badge.gold {
  background-color: #ffd700;
}

.badge.silver {
  background-color: #c0c0c0;
}

.badge.bronze {
  background-color: #cd7f32;
}
`}
      </style>
    </Card>
  );
};

export default Leaderboard;
