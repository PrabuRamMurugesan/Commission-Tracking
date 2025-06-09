import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import "../styles/FranchiseMarketplace.css"; // Import CSS

const FranchiseMarketplace = () => {
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
      const response = await axios.get("/api/franchise/vendors");
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
    <div className="franchise-marketplace-container">
      <h2 className="text-primary mb-4">🏢 Franchise Marketplace</h2>

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
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor, index) => (
              <tr key={index}>
                <td>{vendor.name}</td>
                <td>{vendor.category}</td>
                <td>{vendor.region}</td>
                <td>⭐ {vendor.rating}</td>
                <td>
                  <Button variant="success">Request Collaboration</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Franchise Marketplace Styling */
.franchise-marketplace-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
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
  background-color: #2980b9;
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
  );
};

export default FranchiseMarketplace;


//update

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Modal, Button, Form } from 'react-bootstrap';

// const FranchiseMarketplacePage = () => {
//   const [filter, setFilter] = useState({ state: '', investment: '', platform: '' });
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedFranchise, setSelectedFranchise] = useState(null);

//   const [listings] = useState([
//     {
//       id: 'MP001',
//       title: 'BBSCART Franchise - Coimbatore',
//       region: 'Tamil Nadu / Coimbatore',
//       state: 'Tamil Nadu',
//       platform: 'BBSCART',
//       type: 'Retail + EMI Model',
//       investment: 500000,
//       status: 'Open',
//       applicants: 12
//     },
//     {
//       id: 'MP002',
//       title: 'Golldex Digital Franchise - Jaipur',
//       region: 'Rajasthan / Jaipur',
//       state: 'Rajasthan',
//       platform: 'Golldex',
//       type: 'Gold Investment Desk',
//       investment: 300000,
//       status: 'Closed',
//       applicants: 7
//     }
//   ]);

//   const handleChange = (e) => {
//     setFilter({ ...filter, [e.target.name]: e.target.value });
//   };

//   const handleApply = (item) => {
//     setSelectedFranchise(item);
//     setShowApplyModal(true);
//   };

//   const handleViewDetails = (item) => {
//     setSelectedFranchise(item);
//     setShowDetailModal(true);
//   };

//   const filteredListings = listings.filter(item => {
//     const stateMatch = filter.state ? item.state === filter.state : true;
//     const platformMatch = filter.platform ? item.platform === filter.platform : true;
//     const investmentMatch = filter.investment ?
//       (filter.investment === '<5L' ? item.investment < 500000 : item.investment >= 500000) : true;
//     return stateMatch && platformMatch && investmentMatch;
//   });

//   return (
//     <div className="container-fluid py-4 franchise-marketplace-page bg-light">
//       <div className="container">
//         <h2 className="mb-4">Franchise Marketplace</h2>

//         <div className="row mb-3">
//           <div className="col-md-4">
//             <label className="form-label">Filter by State</label>
//             <select className="form-select" name="state" onChange={handleChange} value={filter.state}>
//               <option value="">All States</option>
//               <option value="Tamil Nadu">Tamil Nadu</option>
//               <option value="Rajasthan">Rajasthan</option>
//             </select>
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Investment Range</label>
//             <select className="form-select" name="investment" onChange={handleChange} value={filter.investment}>
//               <option value="">All</option>
//               <option value="<5L">Less than ₹5L</option>
//               <option value=">=5L">₹5L or more</option>
//             </select>
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Platform</label>
//             <select className="form-select" name="platform" onChange={handleChange} value={filter.platform}>
//               <option value="">All Platforms</option>
//               <option value="BBSCART">BBSCART</option>
//               <option value="Golldex">Golldex</option>
//             </select>
//           </div>
//         </div>

//         <div className="row">
//           {filteredListings.map((item) => (
//             <div className="col-md-6 mb-4" key={item.id}>
//               <div className="card shadow h-100">
//                 <div className="card-body">
//                   <h5 className="card-title">{item.title}</h5>
//                   <p className="card-text"><strong>Region:</strong> {item.region}</p>
//                   <p className="card-text"><strong>Franchise Type:</strong> {item.type}</p>
//                   <p className="card-text"><strong>Required Investment:</strong> ₹{item.investment.toLocaleString()}</p>
//                   <p className="card-text"><strong>Applicants:</strong> {item.applicants}</p>
//                   <span className={`badge bg-${item.status === 'Open' ? 'success' : 'danger'}`}>{item.status}</span>
//                 </div>
//                 <div className="card-footer bg-white border-top-0 d-flex justify-content-end">
//                   <button className="btn btn-outline-primary btn-sm me-2" disabled={item.status !== 'Open'} onClick={() => handleApply(item)}>Apply</button>
//                   <button className="btn btn-outline-secondary btn-sm" onClick={() => handleViewDetails(item)}>View Details</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Apply Modal */}
//         <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Apply for {selectedFranchise?.title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Your Full Name</Form.Label>
//                 <Form.Control type="text" placeholder="Enter your name" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Contact Number</Form.Label>
//                 <Form.Control type="tel" placeholder="Enter phone number" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email Address</Form.Label>
//                 <Form.Control type="email" placeholder="Enter email" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Business Location</Form.Label>
//                 <Form.Control type="text" placeholder="City, State" />
//               </Form.Group>
//               <Button variant="primary" type="submit">
//                 Submit Application
//               </Button>
//             </Form>
//           </Modal.Body>
//         </Modal>

//         {/* Details Modal */}
//         <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Franchise Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedFranchise && (
//               <div>
//                 <p><strong>Title:</strong> {selectedFranchise.title}</p>
//                 <p><strong>Region:</strong> {selectedFranchise.region}</p>
//                 <p><strong>Franchise Type:</strong> {selectedFranchise.type}</p>
//                 <p><strong>Investment:</strong> ₹{selectedFranchise.investment.toLocaleString()}</p>
//                 <p><strong>Status:</strong> {selectedFranchise.status}</p>
//                 <p><strong>Platform:</strong> {selectedFranchise.platform}</p>
//                 <p><strong>Applicants:</strong> {selectedFranchise.applicants}</p>
//               </div>
//             )}
//           </Modal.Body>
//         </Modal>

//       </div>

//       <style>{`
//         .franchise-marketplace-page {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
//         .franchise-marketplace-page .card-title {
//           font-size: 1.2rem;
//           font-weight: 600;
//         }
//         .franchise-marketplace-page .badge {
//           font-size: 0.75rem;
//           padding: 0.4em 0.7em;
//         }
//         .franchise-marketplace-page .btn-sm {
//           font-size: 0.8rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FranchiseMarketplacePage;