import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/FranchiseSelfService.css"; // Import CSS

const FranchiseSelfService = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/franchise-transactions");
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
    doc.text("Franchise Earnings Report", 20, 10);
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
    doc.save("franchise-earnings.pdf");
  };

  return (
    <div className="franchise-selfservice-container">
      <h2 className="text-primary mb-4">🏢 Franchise Self-Service Portal</h2>

      <div className="export-buttons">
        <CSVLink data={transactions} filename="franchise-earnings.csv" className="btn btn-success">
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
          <thead>
            <tr>
              <th>Date</th>
              <th>Agent</th>
              <th>Customer</th>
              <th>Sales Amount</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>{txn.agent}</td>
                <td>{txn.customer}</td>
                <td>${txn.salesAmount}</td>
                <td>${txn.commission}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Franchise Self-Service Styling */
.franchise-selfservice-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.export-buttons {
  margin: 20px 0;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

@media (max-width: 768px) {
  .export-buttons {
    flex-direction: column;
  }
}
`}
      </style>
    </div>
  );
};

export default FranchiseSelfService;


//update

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Modal, Button, Form } from 'react-bootstrap';

// const FranchiseSelfServicePage = () => {
//   const [overview] = useState({
//     franchiseId: 'FR001',
//     location: 'Tamil Nadu / Coimbatore',
//     sales: 1820000,
//     customers: 85,
//     commission: 42000,
//     pendingOrders: 6,
//     conversionRate: '36%'
//   });

//   const [customers] = useState([
//     { name: 'Anjali Verma', type: 'Product', joined: '2025-03-15' },
//     { name: 'Ramesh Iyer', type: 'Investment', joined: '2025-03-17' }
//   ]);

//   const [showModal, setShowModal] = useState({
//     addCustomer: false,
//     uploadOrder: false,
//     raiseTicket: false,
//     requestPayout: false
//   });

//   const toggleModal = (type, value) => {
//     setShowModal({ ...showModal, [type]: value });
//   };

//   return (
//     <div className="container-fluid py-4 franchise-self-service-page bg-light">
//       <div className="container">
//         <h2 className="mb-4">Franchise Self-Service Dashboard</h2>

//         {/* Overview Cards */}
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <div className="card shadow-sm">
//               <div className="card-body text-center">
//                 <h6>Franchise ID</h6>
//                 <p className="fw-bold">{overview.franchiseId}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <div className="card shadow-sm">
//               <div className="card-body text-center">
//                 <h6>Monthly Sales</h6>
//                 <p className="fw-bold text-success">₹{overview.sales.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <div className="card shadow-sm">
//               <div className="card-body text-center">
//                 <h6>Commission Balance</h6>
//                 <p className="fw-bold text-primary">₹{overview.commission.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="row mb-4">
//           <div className="col-md-3 mb-2">
//             <button className="btn btn-outline-primary w-100" onClick={() => toggleModal('addCustomer', true)}>➕ Add Customer</button>
//           </div>
//           <div className="col-md-3 mb-2">
//             <button className="btn btn-outline-success w-100" onClick={() => toggleModal('uploadOrder', true)}>📦 Upload Order</button>
//           </div>
//           <div className="col-md-3 mb-2">
//             <button className="btn btn-outline-warning w-100" onClick={() => toggleModal('raiseTicket', true)}>📨 Raise Ticket</button>
//           </div>
//           <div className="col-md-3 mb-2">
//             <button className="btn btn-outline-info w-100" onClick={() => toggleModal('requestPayout', true)}>💰 Request Payout</button>
//           </div>
//         </div>

//         {/* Customer Table */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-header bg-primary text-white">
//             <h6 className="mb-0">Recent Customers</h6>
//           </div>
//           <div className="card-body p-0">
//             <table className="table mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>Name</th>
//                   <th>Type</th>
//                   <th>Joined On</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customers.map((c, i) => (
//                   <tr key={i}>
//                     <td>{c.name}</td>
//                     <td>{c.type}</td>
//                     <td>{c.joined}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modals */}
//         <Modal show={showModal.addCustomer} onHide={() => toggleModal('addCustomer', false)}>
//           <Modal.Header closeButton><Modal.Title>Add New Customer</Modal.Title></Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Customer Name</Form.Label>
//                 <Form.Control type="text" placeholder="Enter customer name" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Type</Form.Label>
//                 <Form.Select>
//                   <option>Product</option>
//                   <option>Investment</option>
//                 </Form.Select>
//               </Form.Group>
//               <Button variant="primary">Add Customer</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>

//         <Modal show={showModal.uploadOrder} onHide={() => toggleModal('uploadOrder', false)}>
//           <Modal.Header closeButton><Modal.Title>Upload Order</Modal.Title></Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Order Description</Form.Label>
//                 <Form.Control type="text" placeholder="Product or Plan details" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Upload File</Form.Label>
//                 <Form.Control type="file" />
//               </Form.Group>
//               <Button variant="success">Submit Order</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>

//         <Modal show={showModal.raiseTicket} onHide={() => toggleModal('raiseTicket', false)}>
//           <Modal.Header closeButton><Modal.Title>Raise Support Ticket</Modal.Title></Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Subject</Form.Label>
//                 <Form.Control type="text" placeholder="Enter subject" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Message</Form.Label>
//                 <Form.Control as="textarea" rows={4} placeholder="Describe your issue" />
//               </Form.Group>
//               <Button variant="warning">Submit Ticket</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>

//         <Modal show={showModal.requestPayout} onHide={() => toggleModal('requestPayout', false)}>
//           <Modal.Header closeButton><Modal.Title>Request Payout</Modal.Title></Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Payout Amount</Form.Label>
//                 <Form.Control type="number" placeholder="Enter amount to request" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Bank Details</Form.Label>
//                 <Form.Control type="text" placeholder="Account Number / UPI ID" />
//               </Form.Group>
//               <Button variant="info">Submit Payout Request</Button>
//             </Form>
//           </Modal.Body>
//         </Modal>
//       </div>

//       <style>{`
//         .franchise-self-service-page {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
//         .franchise-self-service-page .card-body h6 {
//           font-size: 0.95rem;
//         }
//         .franchise-self-service-page .btn {
//           font-size: 0.9rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FranchiseSelfServicePage;

