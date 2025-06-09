import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";

const ReferralSelfService = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payoutRequest, setPayoutRequest] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/referral-transactions");
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions.");
      setLoading(false);
    }
  };

  const handlePayoutRequest = async () => {
    try {
      await axios.post("/api/referral-request-payout");
      setPayoutRequest(true);
    } catch (error) {
      console.error("Error requesting payout:", error);
      setError("Failed to process payout request.");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Referral Earnings Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Referred Customer", "Sales Amount", "Commission"]],
      body: transactions.map(txn => [
        txn.date,
        txn.referredCustomer,
        `$${txn.salesAmount}`,
        `$${txn.commission}`,
      ]),
    });
    doc.save("referral-earnings.pdf");
  };

  return (
   <div className="referral-selfservice">
    <Sidebar />
    <div className="referral-selfservice-main">
      <h2 className="text-primary mb-4">🔗 Referral Self-Service Portal</h2>
<div className="payout-section-referral-self-service">
      <div className="export-buttons">
        <CSVLink data={transactions} filename="referral-earnings.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      <div className="payout-section">
        <Button variant="primary" onClick={handlePayoutRequest} disabled={payoutRequest}>
          {payoutRequest ? "Payout Requested" : "Request Payout"}
        </Button>
      </div>
      </div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading transactions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Referred Customer</th>
              <th>Sales Amount</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {/* {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>{txn.referredCustomer}</td>
                <td>${txn.salesAmount}</td>
                <td>${txn.commission}</td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      
      <style>
        {`
        /* Referral Self-Service Styling */
        
.referral-selfservice{
  display: flex;
  width: 100vw;
  height: 100vh;
}

.referral-selfservice-main{
  padding: 7% 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.payout-section-referral-self-service{
  display: flex;
  justify-content: space-between;
  align-items: center;
  }

  .export-buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;

}

.payout-section {
  margin: 20px;
  align-items: center;
  display: flex;
  justify-content: end;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

@media (max-width: 768px) {
  .export-buttons, .payout-section {
    flex-direction:row;
  }
    .referral-selfservice-main{
      padding: 8rem 20px;
}
`}
      </style>
    </div>
   </div>
  );
};

export default ReferralSelfService;
