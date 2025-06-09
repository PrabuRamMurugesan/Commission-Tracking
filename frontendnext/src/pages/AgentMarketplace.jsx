

// export default AgentMarketplace;
import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";



const AgentMarketplace = () => {

  const [data, setData] = useState({
    totalEarnings: 0,
    pendingCommissions: 0,
    monthlyEarnings: [],
    topAgents: [],
    loading: true,
  });

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      const response = await axios.get("/api/commission-dashboard");
      setData({ ...response.data, loading: false });
    } catch (error) {
      console.error("Error fetching commission data:", error);
      setData((prevState) => ({ ...prevState, loading: false }));
    }
  };




  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/agent/vendors");
      if (Array.isArray(response.data)) {
        setVendors(response.data);
        setFilteredVendors(response.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to load vendor data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = vendors;
    if (category) {
      filtered = filtered.filter(vendor => vendor.category === category);
    }
    if (region) {
      filtered = filtered.filter(vendor => vendor.region === region);
    }
    setFilteredVendors(filtered);
  };

  return (
    <div className="content-wrapper">
           <Sidebar />
    
      <div className="main-content ">
        <h2 className="text-primary mb-4">🤝 Agent Marketplace</h2>

        {/* Filters */}
        <div className="filters">
          <Form.Control as="select" onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Luxury Watches">Luxury Watches</option>
            <option value="Silverware">Silverware</option>
          </Form.Control>

          <Form.Control as="select" onChange={(e) => setRegion(e.target.value)}>
            <option value="">Select Region</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </Form.Control>

          <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
        </div>

        {/* Loading & Error Handling */}
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
                <th>Vendor</th>
                <th>Category</th>
                <th>Region</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredVendors) && filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => (
                  <tr key={index}>
                    <td>{vendor.name}</td>
                    <td>{vendor.category}</td>
                    <td>{vendor.region}</td>
                    <td>⭐ {vendor.rating}</td>
                    <td>
                      <Button variant="success">Request Collaboration</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No vendors found</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

      

      {/* Styles */}
      <style>
        {`
        .content-wrapper {
          display: flex;
          flex-direction: row;
          justify-content: start;
          gap: 20px;
          width: 100vw;
          height: 100vh;
        }
        .main-content {
          flex-grow: 1;
          padding: 10% 25px;
        }
        .filters {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .filters select {
          width: 30%;
          padding: 10px;
          border-radius: 5px;
        }
        .table {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
        }
        .table thead {
          background-color: #8e44ad;
          color: white;
        }
        .table tbody tr:hover {
          background-color: #ecf0f1;
        }
        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction:row;
            justify-content: center;
            align-items:center;
            width: 100%;
            padding: 30px 80px;
          }
          .filters {
            flex-direction: column;
       
          }
          .filters select {
            width: 100%;
            margin-bottom: 10px;
          }
            .sidebar-agent{
              display: flex;
              flex-direction: row;
              justify-content: start;
              width: 100%;
              height: 100vh;}
        }
        `}
      </style>
    </div>
  );
};

export default AgentMarketplace;
