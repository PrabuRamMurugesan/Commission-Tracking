import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const HierarchyPerformance = () => {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [minEarnings, setMinEarnings] = useState("");

  useEffect(() => {
    fetchHierarchyPerformance();
  }, []);

  const fetchHierarchyPerformance = async () => {
    try {
      const response = await axios.get("/api/hierarchy");

      // ✅ Ensure response is always an array
      const data = Array.isArray(response.data) ? response.data : [];

      setHierarchyData(data);
      setFilteredData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hierarchy data:", error);
      setError("Failed to load hierarchy performance data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = hierarchyData;

    if (role) {
      filtered = filtered.filter((item) => item.role === role);
    }
    if (minEarnings) {
      filtered = filtered.filter(
        (item) => item.totalEarnings >= parseFloat(minEarnings)
      );
    }

    setFilteredData(filtered);
  };

  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="hierarchy-wrapper">
  
        <Sidebar />
    
      
      <div className="content-section flex-grow-1">
      
      <h2 className="text-primary mb-4">📊 Hierarchy Performance</h2>

      <div className="filters mb-3 d-flex flex-wrap gap-3">
        <Form.Control
          as="select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="filter-select"
        >
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control
          type="week"
          placeholder="Maximum Earnings ($)"
          value={minEarnings}
          onChange={(e) => setMinEarnings(e.target.value)}
          className="filter-input"
        />

        <Form.Control
          type="month"
          placeholder="Maximum Earnings ($)"
          value={minEarnings}
          onChange={(e) => setMinEarnings(e.target.value)}
          className="filter-input"
        />
      </div>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">
              Loading hierarchy performance...
            </span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Total Sales ($)</th>
              <th>Total Earnings ($)</th>
              <th>Conversion Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) &&
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>${item.totalSales}</td>
                  <td>${item.totalEarnings}</td>
                  <td>{item.conversionRate}%</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
      

      <style>{`
      .hierarchy-wrapper {
        display: flex;
        width: 100vw;
        height: 100vh;
        
      }
  
  
      .content-section {
        flex-grow: 1;
        background-color: #ffffff;
         padding:10%;
       
      }
  
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }
  
      .filter-select,
      .filter-input {
        flex: 1;
        min-width: 200px;
      }
  
      .table thead {
        background-color: #e67e22;
        color: white;
      }
  
      .table tbody tr:hover {
        background-color: #f2f2f2;
      }
  
      @media (max-width: 768px) {
        .sidebar-section {
          width: 100%;
          min-height: auto;
        }
  
        .content-section {
          width: 100%;
          padding: 30% 20px;
          flex-grow: 0;
        }
  
        .filters {
          flex-direction: column;
          gap: 0.5rem;
       
        }
  
        .filter-select,
        .filter-input,
        .filter-button {
          width: 100%;
        }
    
      }
    `}</style>
    </div>
  );
};

export default HierarchyPerformance;

