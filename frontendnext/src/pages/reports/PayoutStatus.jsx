import React, { useEffect, useState } from "react";
import { Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import "../styles/PayoutStatus.css"; // Import CSS file

const PayoutStatus = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axios.get("/api/payouts");
      setPayouts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setError("Failed to load payout data.");
      setLoading(false);
    }
  };

  return (
    <div className="payout-container">
      <h2 className="text-primary mb-4">💰 Payout Status</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading payouts...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className="payout-card">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Role</th>
                  <th>Amount ($)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, index) => (
                  <tr key={index}>
                    <td>{payout.recipient}</td>
                    <td>{payout.role}</td>
                    <td>${payout.amount}</td>
                    <td>
                      <Badge
                        bg={
                          payout.status === "Completed"
                            ? "success"
                            : payout.status === "Pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {payout.status}
                      </Badge>
                    </td>
                    <td>{new Date(payout.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      <style>
        {`
        .payout-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.payout-card {
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 10px;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

h2.text-primary {
  text-align: center;
}
`}
      </style>
    </div>
  );
};

export default PayoutStatus;
