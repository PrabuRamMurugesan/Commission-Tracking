// import React, { useEffect, useState } from "react";
// import { Table, Button, Spinner, Alert, Form, Modal } from "react-bootstrap";
// import axios from "axios";
// import "../styles/PayoutManagement.css"; // Import CSS

// const PayoutManagement = () => {
//   const [payouts, setPayouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [payoutAmount, setPayoutAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

//   useEffect(() => {
//     fetchPayouts();
//   }, []);

//   const fetchPayouts = async () => {
//     try {
//       const response = await axios.get("/api/payouts");
//       setPayouts(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching payouts:", error);
//       setError("Failed to load payout data.");
//       setLoading(false);
//     }
//   };

//   const handleRequestPayout = async () => {
//     try {
//       await axios.post("/api/payouts/request", {
//         amount: payoutAmount,
//         method: paymentMethod,
//       });
//       setShowModal(false);
//       fetchPayouts();
//     } catch (error) {
//       console.error("Error requesting payout:", error);
//       setError("Payout request failed.");
//     }
//   };

//   return (
//     <div className="payout-management-container">
//       <h2 className="text-primary mb-4">💰 Payout Management</h2>

//       <Button variant="success" onClick={() => setShowModal(true)}>Request Payout</Button>

//       {loading ? (
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading payouts...</span>
//         </Spinner>
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Amount ($)</th>
//               <th>Method</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payouts.map((payout, index) => (
//               <tr key={index}>
//                 <td>{new Date(payout.date).toLocaleDateString()}</td>
//                 <td>${payout.amount}</td>
//                 <td>{payout.method}</td>
//                 <td>
//                   <span className={payout.status === "Completed" ? "status-completed" : "status-pending"}>
//                     {payout.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}

//       {/* Payout Request Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Request Payout</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Amount ($)</Form.Label>
//               <Form.Control type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Payment Method</Form.Label>
//               <Form.Control as="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//                 <option>Bank Transfer</option>
//                 <option>Wallet</option>
//                 <option>PayPal</option>
//               </Form.Control>
//             </Form.Group>
//             <Button variant="success" className="mt-3" onClick={handleRequestPayout}>Submit Request</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//       <style>
//         {`
//         /* Payout Management Styling */
// .payout-management-container {
//   padding: 20px;
//   max-width: 90%;
//   margin: auto;
// }

// .table {
//   background-color: white;
//   border-radius: 10px;
//   overflow: hidden;
// }

// .table thead {
//   background-color: #27ae60;
//   color: white;
// }

// .table tbody tr:hover {
//   background-color: #ecf0f1;
// }

// .status-pending {
//   background-color: #f1c40f;
//   color: white;
//   padding: 5px 10px;
//   border-radius: 5px;
// }

// .status-completed {
//   background-color: #2ecc71;
//   color: white;
//   padding: 5px 10px;
//   border-radius: 5px;
// }

// @media (max-width: 768px) {
//   .payout-management-container {
//     width: 100%;
//     padding: 10px;
//   }
// }
// `}
//       </style>
//     </div>
//   );
// };

// export default PayoutManagement;


//update
import React, { useState } from 'react';
import { Table, Modal, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const PayoutManagementPage = () => {
  const [payouts, setPayouts] = useState([
    {
      id: 'P001', user: 'Ravi Kumar', role: 'Franchise', amount: '₹25,000', method: 'Bank Transfer', status: 'Pending', requested: '2025-04-01', paid: '2025-04-03', txnId: 'TXN2390480'
    },
    {
      id: 'P002', user: 'Neha Mehta', role: 'CBAV', amount: '$150', method: 'Wallet', status: 'Paid', requested: '2025-03-28', paid: '2025-03-30', txnId: 'TXN2390481'
    }
  ]);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [form, setForm] = useState({ txnId: '', status: '' });

  const handleApprove = (index) => {
    setCurrentIndex(index);
    setForm({ txnId: '', status: 'Paid' });
    setShowModal(true);
  };

  const handleReject = (index) => {
    if (window.confirm('Are you sure you want to reject this payout?')) {
      const updated = [...payouts];
      updated[index].status = 'Rejected';
      setPayouts(updated);
    }
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this payout record?')) {
      const updated = [...payouts];
      updated.splice(index, 1);
      setPayouts(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...payouts];
    updated[currentIndex].status = form.status;
    updated[currentIndex].txnId = form.txnId;
    updated[currentIndex].paid = new Date().toISOString().split('T')[0];
    setPayouts(updated);
    setShowModal(false);
  };

  const filteredPayouts = payouts.filter(p =>
    (filterRole ? p.role === filterRole : true) &&
    (filterStatus ? p.status === filterStatus : true) &&
    (search ? p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) : true)
  );

  const exportData = (format) => {
    alert(`Exporting data as ${format}`);
    // Placeholder for actual export logic (PDF/Excel)
  };

  return (
    <>
<div className="payout-management-container d-flex vw-100 vh-100">
  {/* Sidebar Section */}
  <Sidebar />

  {/* Main Content Section */}
  <div className="flex-grow-1 d-flex justify-content-center  align-items-center p-5 p-md-5 p-lg-5 h-full w-100">
    <div className="container border border-dark rounded p-4 w-100 w-md-75 bg-white">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h2 className="mb-2 mb-md-0">Payout Management</h2>
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={() => exportData('PDF')}>Export PDF</Button>
          <Button variant="outline-secondary" onClick={() => exportData('Excel')}>Export Excel</Button>
        </div>
      </div>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4} className="mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search by User or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4} className="mb-2 mb-md-0">
          <Form.Select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">Filter by Role</option>
            <option value="Franchise">Franchise</option>
            <option value="Agent">Agent</option>
            <option value="CBAV">CBAV</option>
            <option value="Vendor">Vendor</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Filter by Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Role</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Paid Date</th>
            <th>Txn ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayouts.map((p, i) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.user}</td>
              <td>{p.role}</td>
              <td>{p.amount}</td>
              <td>{p.method}</td>
              <td>
                <Badge
                  bg={p.status === 'Paid' ? 'success' : p.status === 'Rejected' ? 'danger' : 'warning'}
                >
                  {p.status}
                </Badge>
              </td>
              <td>{p.requested}</td>
              <td>{p.paid}</td>
              <td>{p.txnId}</td>
              <td>
                {p.status === 'Pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="me-2"
                      onClick={() => handleApprove(i)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="me-2"
                      onClick={() => handleReject(i)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => handleDelete(i)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Payout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Transaction ID</Form.Label>
              <Form.Control
                type="text"
                value={form.txnId}
                onChange={e => setForm({ ...form, txnId: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Confirm & Approve</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  </div>
  <style>{`
            
  `}</style>
  
</div>

  </>
  );
};

export default PayoutManagementPage;
