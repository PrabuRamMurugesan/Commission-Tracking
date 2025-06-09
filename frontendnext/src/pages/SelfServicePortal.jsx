import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const SelfServicePortal = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await axios.get("/api/selfservice/commissions");
      setCommissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commission data:", error);
      setError("Failed to load commission details.");
      setLoading(false);
    }
  };

  return (
   <div className="self-service-portal-container">
    <Sidebar/>
    <div className="self-service-container">
      <h2 className="text-primary mb-4">📈 Self-Service Commission Portal</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading commissions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Role</th>
              <th>Total Earnings ($)</th>
            </tr>
          </thead>
          <tbody>
            {/* {commissions.map((commission, index) => (
              <tr key={index}>
                <td>{commission.user}</td>
                <td>{commission.role}</td>
                <td>${commission.amount}</td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      <style>
        {`
        .self-service-portal-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }
        .self-service-container {
          padding: 7% 20px;
          width: 100%;
          height: 100%;
        }
          @media (max-width: 768px) {
            .self-service-container {
              padding: 7rem  20px;
            }
          }
        `}
      </style>
    </div>

   </div>
  );
};

export default SelfServicePortal;
