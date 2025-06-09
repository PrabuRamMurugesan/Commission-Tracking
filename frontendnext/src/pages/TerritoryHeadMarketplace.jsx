import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const TerritoryHeadMarketplace = () => {
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
      const response = await axios.get("/api/territoryhead/vendors");
      setVendors(response.data);
      setFilteredVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to load vendor data.");
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
    <div className="territory-head-marketplace">
      <Sidebar/>
      <div className="territory-head-marketplace-container">
      <h2 className="text-primary mb-4">🏢 Territory Head Marketplace</h2>

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
              <th>Status</th>
              <th>Contact Details</th>
              <th>Total Sales</th>
              <th>List of support ticket/ issues</th>
              <th>View</th>           
            </tr>
          </thead>
          <tbody>
            {/* {filteredVendors.map((vendor, index) => (
              <tr key={index}>
                <td>{vendor.name}</td>
                <td>{vendor.category}</td>
                <td>{vendor.region}</td>
                <td>⭐ {vendor.rating}</td>
                <td>
                  <Button variant="success">Request Collaboration</Button>
                </td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      <style>
        {`
       .territory-head-marketplace {
         display: flex;
         width: 100vw;
         height: 100vh;
       }
.territory-head-marketplace-container {
  padding: 7rem 50px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
 margin: 0 auto;
}

.filters {
  display: flex;
  justify-content: start;
  align-items: stretch;
  gap: 10px;
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
  background-color: #27ae60;
  color: white;
}

.table tbody tr:hover {
  background-color: #ecf0f1;
}

.button-container {
  text-align: center;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
    </div>
  );
};

export default TerritoryHeadMarketplace;
