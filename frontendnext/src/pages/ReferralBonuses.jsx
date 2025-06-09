import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const ReferralBonuses = () => {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchReferralBonuses();
  }, []);

  const fetchReferralBonuses = async () => {
    try {
      const response = await axios.get("/api/referral-bonuses");
      setReferrals(response.data);
      setFilteredReferrals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referral bonuses:", error);
      setError("Failed to load referral bonuses.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = referrals;
    if (status) {
      filtered = filtered.filter(referral => referral.payoutStatus === status);
    }
    setFilteredReferrals(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Referral Bonuses Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Referrer", "Referred User", "Bonus ($)", "Payout Status"]],
      body: filteredReferrals.map(referral => [
        referral.date, referral.referrer, referral.referredUser, referral.bonusAmount, referral.payoutStatus,
      ]),
    });
    doc.save("referral-bonuses.pdf");
  };

  return (
    <div className="referral-bonuses-page">
      <Sidebar />
      <div className="referral-bonuses-main">
      <h2 className="text-primary mb-4">🎁 Referral Bonuses</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setStatus(e.target.value)}>
          <option value="">Filter by Payout Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={filteredReferrals} filename="referral-bonuses.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading referral bonuses...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Referrer</th>
              <th>Referred User</th>
              <th>Bonus ($)</th>
              <th>Payout Status</th>
            </tr>
          </thead>
          <tbody>
            {/* {filteredReferrals.map((referral, index) => (
              <tr key={index}>
                <td>{new Date(referral.date).toLocaleString()}</td>
                <td>{referral.referrer}</td>
                <td>{referral.referredUser}</td>
                <td>{referral.bonusAmount}</td>
                <td>{referral.payoutStatus}</td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      <style>
        {`
       .referral-bonuses-page{
       display: flex;
       width: 100vw;
       height: 100vh;

       }
.referral-bonuses-main{
  padding:7rem 20px;
  width: 100%;
  height: 100%;
}
.filters{
display: flex;
justify-content: space-between;
margin-bottom: 10px;
row-gap: 20px;
flex-wrap: wrap;
}
.export-buttons{
display: flex;
justify-content: end;
margin-bottom: 10px;
column-gap: 20px;
flex-wrap: wrap;
}
`}
      </style>
    </div>
    </div>
  );
};

export default ReferralBonuses;
