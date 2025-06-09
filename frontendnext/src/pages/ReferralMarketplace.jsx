import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const ReferralMarketplace = () => {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [referralType, setReferralType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await axios.get("/api/referrals");
      setReferrals(response.data);
      setFilteredReferrals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      setError("Failed to load referral data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = referrals;
    if (referralType) {
      filtered = filtered.filter(ref => ref.type === referralType);
    }
    if (status) {
      filtered = filtered.filter(ref => ref.status === status);
    }
    setFilteredReferrals(filtered);
  };

  return (
    <div className="referral-marketplace-page">
      <Sidebar />
      <div className="referral-marketplace-main">
      <h2 className="text-primary mb-4">🎯 Referral Marketplace</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setReferralType(e.target.value)}>
          <option value="">Select Referral Type</option>
          <option value="Customer">Customer</option>
          <option value="Vendor">Vendor</option>
          <option value="Agent">Agent</option>
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading referrals...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Referred User</th>
              <th>Referral Type</th>
              <th>Commission Earned ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* {filteredReferrals.map((ref, index) => (
              <tr key={index}>
                <td>{ref.name}</td>
                <td>{ref.type}</td>
                <td>${ref.commission}</td>
                <td>
                  <span className={ref.status === "Completed" ? "status-completed" : "status-pending"}>
                    {ref.status}
                  </span>
                </td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Referral Marketplace Styling */
.referral-marketplace-page{
 display: flex;
width: 100vw;
height: 100vh;
}
.referral-marketplace-main{
 padding: 7% 20px;
 width: 100%;
 height: 100%;
}
 .filters{
 display: flex;
 flex-direction: row;
 row-gap: 10px;
 margin-bottom: 20px;
 justify-content:start;
 align-items: center;
 flex-wrap: wrap;
 }
@media (max-width: 768px) {
  .referral-marketplace-main{
    padding: 7rem 10px;
  }
}
.
`}
      </style>
    </div>
    </div>
  );
};

export default ReferralMarketplace;
