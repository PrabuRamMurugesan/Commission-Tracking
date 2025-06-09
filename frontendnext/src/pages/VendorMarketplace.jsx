import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const VendorMarketplace = () => {
  const [vendors, setVendors] = useState([]); // Ensure vendors is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/vendors");

      // Ensure that response data is an array
      if (Array.isArray(response.data)) {
        setVendors(response.data);
      } else {
        throw new Error("Data is not an array");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to load vendor data.");
      setLoading(false);
    }
  };

  return (
    <div className="vendor-marketplace">
      <Sidebar />
      <div className="vendor-marketplace-content">
        <h2 className="text-primary mb-4">🛍️ Vendor Marketplace</h2>

        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading vendors...</span>
          </Spinner>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={index}>
                  <td>{vendor.name}</td>
                  <td>{vendor.category}</td>
                  <td>⭐{vendor.rating}</td>
                  <td>
                    <Button variant="primary">View Profile</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <style>
        {`
          /* Vendor Marketplace Styling */
          .vendor-marketplace {
            display: flex;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }

          .vendor-marketplace-content {
          
            padding: 7% 20px;
            overflow-y: auto;
            width:100%;
            height: 100%;
          }

          .vendor-marketplace h2 {
            font-weight: bold;
            color: #2c3e50;
            text-align: left;
            padding-left: 20px;
          }

          .table th, .table td {
            text-align: center;
            vertical-align: middle;
          }

          .table {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .table thead {
            background-color: #2c3e50;
            color: white;
          }

          .table tbody tr:hover {
            background-color: #ecf0f1;
          }

          @media (max-width: 768px) {
            .vendor-marketplace {
              flex-direction: column;
            }


            .vendor-marketplace-content {
              padding: 7rem  10px;
              width:100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VendorMarketplace;
