import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const VendorSelfService = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get("/api/vendors/earnings");

      if (Array.isArray(response.data)) {
        setEarnings(response.data);
      } else if (response.data && Array.isArray(response.data.earnings)) {
        setEarnings(response.data.earnings);
      } else {
        throw new Error("Unexpected earnings data format");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor earnings:", error);
      setError("Failed to load earnings data.");
      setLoading(false);
    }
  };

  return (
    <div className="vendor-self-service-page">
      <Sidebar />
      <div className="self-service-container">
        <h2 className="text-primary mb-4">💰 Vendor Self-Service Portal</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading earnings...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive className="vendor-earnings-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Total Sales ($)</th>
                <th>Commission Earned ($)</th>
                <th>Payout Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((vendor, index) => (
                <tr key={index}>
                  <td>{vendor.name}</td>
                  <td>${vendor.sales}</td>
                  <td>${vendor.commission}</td>
                  <td>
                    <span
                      className={
                        vendor.payoutStatus === "Completed"
                          ? "payout-status-completed"
                          : "payout-status-pending"
                      }
                    >
                      {vendor.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <style>
          {`
          .vendor-self-service-page {
            display: flex;
            width:100vw;
            height:100vh;
          }

          .self-service-container {
            padding: 8% 30px;
            width:100%;
            height:100%;
            overflow-x: auto;
          }

          .self-service-container h2 {
            text-align: center;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
          }

          .vendor-earnings-table {
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .vendor-earnings-table thead {
            background-color: #16a085;
            color: #ffffff;
          }

          .vendor-earnings-table tbody tr:hover {
            background-color: #ecf0f1;
            transition: background-color 0.3s ease;
          }

          .payout-status-completed {
            background-color: #2ecc71;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .payout-status-pending {
            background-color: #f39c12;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
          }

          @media (max-width: 992px) {
            .vendor-self-service-page {
              flex-direction: column;
            }
            .self-service-container {
              padding: 20px;
            }
          }

          @media (max-width: 768px) {
            .self-service-container {
              padding: 15px;
            }
            .vendor-earnings-table {
              font-size: 0.85rem;
            }
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default VendorSelfService;
