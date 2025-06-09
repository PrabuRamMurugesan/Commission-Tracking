import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../components/Sidebar";
const TerritoryHeadSelfService = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/territory-head-transactions");
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions.");
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Territory Head Earnings Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Agent", "Customer", "Sales Amount", "Commission"]],
      body: transactions.map(txn => [
        txn.date,
        txn.agent,
        txn.customer,
        `$${txn.salesAmount}`,
        `$${txn.commission}`,
      ]),
    });
    doc.save("territory-head-earnings.pdf");
  };

  return (
    <div className="territory-head-selfservice-page">
      <Sidebar/>
      <div className="territory-head-selfservice-container">
      <h2 className="text-primary mb-4">👔 Territory Head Self-Service Portal</h2>

      <div className="export-buttons">
        <CSVLink data={transactions} filename="territory-head-earnings.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading transactions...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead >
            <tr className="table-primary">
            <th>Date</th>
            <th>Agent</th>
            <th>Customer</th>
              <th>Total Vendors Managed</th>
              <th>Active Vendors</th>
              <th>Inactive Vendors</th> 
              <th>Open Support Tickets</th>
              
              <th>Total Earnings</th>
              <th>Commission Earned</th>
            </tr>
          </thead>
          <tbody>
            {/* {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>{txn.agent}</td>
                <td>{txn.customer}</td>
                <td>${txn.salesAmount}</td>
                <td>${txn.commission}</td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Territory Head Self-Service Styling */
        .territory-head-selfservice-page {
          display: flex;
          width: 100vw;
          height: 100vh;
        }
.territory-head-selfservice-container {
  padding: 7% 20px;
  width: 100%;
  height: 100;
  overflow-y: scroll;
}

.export-buttons {
  margin: 20px 10px;
  gap: 10px;
  display: flex;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}
.table-primary th{
padding: 5px;
}
@media (max-width: 768px) {
 .territory-head-selfservice-container {
   padding: 7rem 20px;
 }
  .export-buttons {
    flex-direction: column;
  }
}
`}
      </style>
    </div>
    </div>
  );
};

export default TerritoryHeadSelfService;
