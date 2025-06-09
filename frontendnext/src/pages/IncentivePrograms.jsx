//update

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Modal, Button, Form } from 'react-bootstrap';

// const IncentiveProgramsPage = () => {
//   const [filter, setFilter] = useState({ role: '', status: '', rewardType: '' });
//   const [showModal, setShowModal] = useState(false);
//   const [programs, setPrograms] = useState([
//     {
//       id: 'INC001',
//       name: 'Gold Sales Bonus',
//       role: 'Franchise',
//       target: '₹5,00,000 sales/month',
//       reward: '₹10,000 bonus',
//       status: 'Active',
//       progress: 80
//     },
//     {
//       id: 'INC002',
//       name: 'CBAV Referral Marathon',
//       role: 'Agent',
//       target: '50 new CBAVs in 30 days',
//       reward: 'Amazon Gift Card ₹5,000',
//       status: 'In Progress',
//       progress: 45
//     },
//     {
//       id: 'INC003',
//       name: 'Investment Booster',
//       role: 'CBAV',
//       target: '₹1,00,000 in new investments',
//       reward: '₹3,000 cashback',
//       status: 'Completed',
//       progress: 100
//     }
//   ]);

//   const handleAddProgram = (e) => {
//     e.preventDefault();
//     // Placeholder for add logic
//     alert('Program added (connect to backend)');
//     setShowModal(false);
//   };

//   const filteredPrograms = programs.filter(p => {
//     const roleMatch = filter.role ? p.role === filter.role : true;
//     const statusMatch = filter.status ? p.status === filter.status : true;
//     const rewardMatch = filter.rewardType ? p.reward.toLowerCase().includes(filter.rewardType.toLowerCase()) : true;
//     return roleMatch && statusMatch && rewardMatch;
//   });

//   return (
//     <div className="container py-4 bg-light">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Incentive Programs</h2>
//         <Button variant="primary" onClick={() => setShowModal(true)}>+ Add Incentive</Button>
//       </div>

//       {/* Filters */}
//       <div className="row mb-4">
//         <div className="col-md-4">
//           <Form.Label>Filter by Role</Form.Label>
//           <Form.Select value={filter.role} onChange={e => setFilter({ ...filter, role: e.target.value })}>
//             <option value=''>All</option>
//             <option value='Franchise'>Franchise</option>
//             <option value='Agent'>Agent</option>
//             <option value='CBAV'>CBAV</option>
//           </Form.Select>
//         </div>
//         <div className="col-md-4">
//           <Form.Label>Filter by Status</Form.Label>
//           <Form.Select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
//             <option value=''>All</option>
//             <option value='Active'>Active</option>
//             <option value='In Progress'>In Progress</option>
//             <option value='Completed'>Completed</option>
//           </Form.Select>
//         </div>
//         <div className="col-md-4">
//           <Form.Label>Search Reward Type</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Cashback, Bonus, Gift Card"
//             value={filter.rewardType}
//             onChange={e => setFilter({ ...filter, rewardType: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="row">
//         {filteredPrograms.map(program => (
//           <div key={program.id} className="col-md-4 mb-4">
//             <div className="card shadow-sm h-100">
//               <div className="card-body">
//                 <h5 className="card-title text-primary">{program.name}</h5>
//                 <p className="mb-1"><strong>Role:</strong> {program.role}</p>
//                 <p className="mb-1"><strong>Target:</strong> {program.target}</p>
//                 <p className="mb-1"><strong>Reward:</strong> {program.reward}</p>
//                 <p className="mb-1"><strong>Status:</strong> <span className={`badge ${program.status === 'Completed' ? 'bg-success' : program.status === 'Active' ? 'bg-info' : 'bg-warning text-dark'}`}>{program.status}</span></p>
//                 <div className="progress mt-3">
//                   <div
//                     className="progress-bar"
//                     role="progressbar"
//                     style={{ width: `${program.progress}%` }}
//                     aria-valuenow={program.progress}
//                     aria-valuemin="0"
//                     aria-valuemax="100"
//                   >
//                     {program.progress}%
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Incentive Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Incentive Program</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleAddProgram}>
//             <Form.Group className="mb-3">
//               <Form.Label>Program Name</Form.Label>
//               <Form.Control type="text" required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Role</Form.Label>
//               <Form.Select required>
//                 <option value=''>Select</option>
//                 <option value='Franchise'>Franchise</option>
//                 <option value='Agent'>Agent</option>
//                 <option value='CBAV'>CBAV</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Target</Form.Label>
//               <Form.Control type="text" required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Reward</Form.Label>
//               <Form.Control type="text" required />
//             </Form.Group>
//             <Button type="submit" variant="primary">Save</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       <style>{`
//         .card-title {
//           font-size: 1.1rem;
//           font-weight: 600;
//         }
//         .progress {
//           height: 1.25rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default IncentiveProgramsPage;




// import React, { useEffect, useState } from "react";
// import { Table, Spinner, Alert, Form, Button, Modal } from "react-bootstrap";
// import axios from "axios";
// // import "../styles/IncentivePrograms.css"; // Import CSS

// const IncentivePrograms = () => {
//   const [programs, setPrograms] = useState([]);
//   const [filteredPrograms, setFilteredPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [role, setRole] = useState("");
//   const [show, setShow] = useState(false);
//   const [newProgram, setNewProgram] = useState({ title: "", description: "", eligibility: "", reward: "" });

//   useEffect(() => {
//     fetchIncentivePrograms();
//   }, []);

//   const fetchIncentivePrograms = async () => {
//     try {
//       const response = await axios.get("/api/incentive-programs");
//       setPrograms(response.data);
//       setFilteredPrograms(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching incentive programs:", error);
//       setError("Failed to load incentive programs.");
//       setLoading(false);
//     }
//   };

//   const handleFilter = () => {
//     let filtered = programs;
//     if (role) {
//       filtered = filtered.filter(program => program.eligibility === role);
//     }
//     setFilteredPrograms(filtered);
//   };

//   const handleAddProgram = async () => {
//     try {
//       await axios.post("/api/incentive-programs/add", newProgram);
//       alert("New incentive program added successfully!");
//       setShow(false);
//       fetchIncentivePrograms();
//     } catch (error) {
//       console.error("Error adding incentive program:", error);
//       setError("Failed to add program. Try again.");
//     }
//   };

//   return (
//     <div className="incentive-programs-container">
//       <h2 className="text-primary mb-4">🎯 Incentive Programs</h2>

//       <div className="filters">
//         <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
//           <option value="">Filter by Eligibility</option>
//           <option value="Franchise">Franchise</option>
//           <option value="Territory Head">Territory Head</option>
//           <option value="Agent">Agent</option>
//           <option value="Vendor">Vendor</option>
//           <option value="Referral">Referral</option>
//         </Form.Control>

//         <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
//         <Button variant="success" onClick={() => setShow(true)}>New Incentive</Button>
//       </div>

//       {loading ? (
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading incentive programs...</span>
//         </Spinner>
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Description</th>
//               <th>Eligibility</th>
//               <th>Reward</th>
//             </tr>
//           </thead>
//           <tbody>
//             {((program, index) => (
//               <tr key={index}>
//                 <td>{program.title}</td>
//                 <td>{program.description}</td>
//                 <td>{program.eligibility}</td>
//                 <td>{program.reward}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}

//       <Modal show={show} onHide={() => setShow(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>New Incentive Program</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Title</Form.Label>
//               <Form.Control type="text" onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Eligibility</Form.Label>
//               <Form.Control type="text" onChange={(e) => setNewProgram({ ...newProgram, eligibility: e.target.value })} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Reward</Form.Label>
//               <Form.Control type="text" onChange={(e) => setNewProgram({ ...newProgram, reward: e.target.value })} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
//           <Button variant="primary" onClick={handleAddProgram}>Submit</Button>
//         </Modal.Footer>
//       </Modal>
//       <style>
//         {`
//         /* Incentive Programs Styling */
// .incentive-programs-container {
//   padding: 20px;
//   max-width: 90%;
//   margin: auto;
//   background-color: #f8f9fa;
//   border-radius: 10px;
//   padding: 20px;
// }

// .filters {
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 20px;
// }

// .filters select {
//   width: 30%;
//   padding: 10px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
// }

// .table {
//   background-color: white;
//   border-radius: 10px;
//   overflow: hidden;
// }

// .table thead {
//   background-color: #007bff;
//   color: white;
// }

// .table tbody tr:hover {
//   background-color: #e9ecef;
// }

// .modal-content {
//   border-radius: 10px;
// }

// .modal-header {
//   background-color: #007bff;
//   color: white;
//   border-radius: 10px 10px 0 0;
// }

// .modal-footer {
//   background-color: #f1f1f1;
// }

// .btn-success {
//   background-color: #28a745;
//   border: none;
// }

// @media (max-width: 768px) {
//   .filters {
//     flex-direction: column;
//   }

//   .filters select {
//     width: 100%;
//     margin-bottom: 10px;
//   }
// }

//         `}
//       </style>
//     </div>
//   );
// };

// export default IncentivePrograms;

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const IncentiveProgramsPage = () => {
  const [filter, setFilter] = useState({ role: '', status: '', rewardType: '' });
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', target: '', reward: '', status: 'Active', progress: 0 });
  const [programs, setPrograms] = useState([
    {
      id: 'INC001',
      name: 'Gold Sales Bonus',
      role: 'Franchise',
      target: '₹5,00,000 sales/month',
      reward: '₹10,000 bonus',
      status: 'Active',
      progress: 80
    },
    {
      id: 'INC002',
      name: 'CBAV Referral Marathon',
      role: 'Agent',
      target: '50 new CBAVs in 30 days',
      reward: 'Amazon Gift Card ₹5,000',
      status: 'In Progress',
      progress: 45
    },
    {
      id: 'INC003',
      name: 'Investment Booster',
      role: 'CBAV',
      target: '₹1,00,000 in new investments',
      reward: '₹3,000 cashback',
      status: 'Completed',
      progress: 100
    }
  ]);

  const handleAddProgram = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...programs];
      updated[editIndex] = { ...updated[editIndex], ...formData };
      setPrograms(updated);
    } else {
      setPrograms([...programs, { ...formData, id: `INC00${programs.length + 1}` }]);
    }
    setShowModal(false);
    setEditIndex(null);
    setFormData({ name: '', role: '', target: '', reward: '', status: 'Active', progress: 0 });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(programs[index]);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure to delete this incentive?')) {
      const updated = [...programs];
      updated.splice(index, 1);
      setPrograms(updated);
    }
  };

  const filteredPrograms = programs.filter(p => {
    const roleMatch = filter.role ? p.role === filter.role : true;
    const statusMatch = filter.status ? p.status === filter.status : true;
    const rewardMatch = filter.rewardType ? p.reward.toLowerCase().includes(filter.rewardType.toLowerCase()) : true;
    return roleMatch && statusMatch && rewardMatch;
  });

  return (
    <div className="container-fluid p-0 bg-light w- ip-container">
  <div className="d-flex flex-wrap">
    <Sidebar />

    <div className="flex-grow-1 incentive-programs-container ">
      <div className="row align-items-center ">
        <div className="col-12 col-md-6">
          <h2>Incentive Programs</h2>
        </div>
        <div className="col-12 col-md-6 text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={() => setShowModal(true)}>+ Add Incentive</Button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <Form.Label>Filter by Role</Form.Label>
          <Form.Select value={filter.role} onChange={e => setFilter({ ...filter, role: e.target.value })}>
            <option value=''>All</option>
            <option value='Franchise'>Franchise</option>
            <option value='Agent'>Agent</option>
            <option value='CBAV'>CBAV</option>
          </Form.Select>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Label>Filter by Status</Form.Label>
          <Form.Select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value=''>All</option>
            <option value='Active'>Active</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
          </Form.Select>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Label>Search Reward Type</Form.Label>
          <Form.Control type="text" placeholder="Cashback, Bonus, Gift Card" value={filter.rewardType} onChange={e => setFilter({ ...filter, rewardType: e.target.value })} />
        </div>
      </div>

      <div className="row">
        {filteredPrograms.map((program, i) => (
          <div key={program.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">{program.name}</h5>
                <p className="mb-1"><strong>Role:</strong> {program.role}</p>
                <p className="mb-1"><strong>Target:</strong> {program.target}</p>
                <p className="mb-1"><strong>Reward:</strong> {program.reward}</p>
                <p className="mb-1">
                  <strong>Status:</strong>
                  <span className={`badge ms-2 ${program.status === 'Completed' ? 'bg-success' : program.status === 'Active' ? 'bg-info' : 'bg-warning text-dark'}`}>
                    {program.status}
                  </span>
                </p>
                <div className="progress mt-2 mb-2">
                  <div className="progress-bar" role="progressbar" style={{ width: `${program.progress}%` }} aria-valuenow={program.progress} aria-valuemin="0" aria-valuemax="100">
                    {program.progress}%
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(i)}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(i)}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditIndex(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit' : 'Add'} Incentive Program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProgram}>
            <Form.Group className="mb-3">
              <Form.Label>Program Name</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required>
                <option value=''>Select</option>
                <option value='Franchise'>Franchise</option>
                <option value='Agent'>Agent</option>
                <option value='CBAV'>CBAV</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target</Form.Label>
              <Form.Control type="text" value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reward</Form.Label>
              <Form.Control type="text" value={formData.reward} onChange={e => setFormData({ ...formData, reward: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value='Active'>Active</option>
                <option value='In Progress'>In Progress</option>
                <option value='Completed'>Completed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Progress (%)</Form.Label>
              <Form.Control type="number" min="0" max="100" value={formData.progress} onChange={e => setFormData({ ...formData, progress: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="primary">{editIndex !== null ? 'Update' : 'Save'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
        }
        .progress {
          height: 1.25rem;
        }

        .ip-container
        {
          height: 100vh;
          width: 100vw;
        }
          .incentive-programs-container{
            padding: 120px 50px;}
      `}</style>
    </div>
  </div>
</div>

  );
};

export default IncentiveProgramsPage;

