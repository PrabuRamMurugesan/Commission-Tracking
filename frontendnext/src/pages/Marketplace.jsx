
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const MarketplacePage = () => {
  const [filters, setFilters] = useState({ role: '', location: '', keyword: '' });
  const [showDetail, setShowDetail] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ title: '', role: '', location: '', investment: '', description: '', deadline: '' });
  const [listings, setListings] = useState([
    {
      id: 'M001',
      title: 'Franchise Opportunity – Chennai',
      role: 'Franchise',
      location: 'Tamil Nadu',
      investment: '₹5,00,000',
      description: 'Start your BBSCART Franchise in Chennai with exclusive training and onboarding support.',
      deadline: '2025-06-30'
    },
    {
      id: 'M002',
      title: 'Gold Investment Vendor – Mumbai',
      role: 'Vendor',
      location: 'Maharashtra',
      investment: '₹2,00,000',
      description: 'Partner with Golldex as an approved vendor for digital gold schemes in Mumbai.',
      deadline: '2025-07-15'
    }
  ]);

  const filteredListings = listings.filter(item => {
    const roleMatch = filters.role ? item.role === filters.role : true;
    const locationMatch = filters.location ? item.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const keywordMatch = filters.keyword ? item.title.toLowerCase().includes(filters.keyword.toLowerCase()) : true;
    return roleMatch && locationMatch && keywordMatch;
  });

  const openDetail = (listing) => {
    setSelectedListing(listing);
    setShowDetail(true);
  };

  const handleEdit = (index) => {
    setFormData(listings[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure to delete this listing?')) {
      const updated = [...listings];
      updated.splice(index, 1);
      setListings(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...listings];
      updated[editIndex] = { ...formData };
      setListings(updated);
    } else {
      setListings([...listings, { ...formData, id: `M00${listings.length + 1}` }]);
    }
    setShowForm(false);
    setEditIndex(null);
    setFormData({ title: '', role: '', location: '', investment: '', description: '', deadline: '' });
  };

  return (
    <div className="marketplace-container">
      <Sidebar />
     <div className='marketplace-container-content'>
     
        <h2>Marketplace</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>+ Add Listing (Admin)</Button>
      

      {/* Filters */}
      <div className="">
        <div className="">
          <Form.Label>Filter by Role</Form.Label>
          <Form.Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value=''>All</option>
            <option value='Franchise'>Franchise</option>
            <option value='Vendor'>Vendor</option>
          </Form.Select>
        </div>
        <div className="col-md-4">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" placeholder="e.g., Tamil Nadu" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        </div>
        <div className="col-md-4">
          <Form.Label>Keyword</Form.Label>
          <Form.Control type="text" placeholder="Search by title..." value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
        </div>
      </div>

      {/* Listing Cards */}
      <div className="row pt-3 listing-cards">
        {filteredListings.map((listing, i) => (
          <div className="col-md-6 mb-4" key={listing.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">{listing.title}</h5>
                <p className="mb-1"><strong>Location:</strong> {listing.location}</p>
                <p className="mb-1"><strong>Investment:</strong> {listing.investment}</p>
                <p className="mb-1"><strong>Deadline:</strong> {listing.deadline}</p>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="outline-info" size="sm" onClick={() => openDetail(listing)}>View</Button>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(i)}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(i)}>Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Detail Modal */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedListing?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Role:</strong> {selectedListing?.role}</p>
          <p><strong>Location:</strong> {selectedListing?.location}</p>
          <p><strong>Investment:</strong> {selectedListing?.investment}</p>
          <p><strong>Deadline:</strong> {selectedListing?.deadline}</p>
          <p className="mt-3">{selectedListing?.description}</p>
          <Button variant="success" className="mt-2">Apply Now</Button>
        </Modal.Body>
      </Modal>

      {/* Add/Edit Listing Modal */}
      <Modal show={showForm} onHide={() => { setShowForm(false); setEditIndex(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit' : 'Add'} Marketplace Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                <option value=''>Select</option>
                <option value='Franchise'>Franchise</option>
                <option value='Vendor'>Vendor</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Investment</Form.Label>
              <Form.Control type="text" value={formData.investment} onChange={(e) => setFormData({ ...formData, investment: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="primary">{editIndex !== null ? 'Update' : 'Save'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

     </div>
     <style>{`
  .marketplace-container {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
  }

  .marketplace-container-content {
    width: 100%;
    height: 100%;
    padding: 10% 50px;
  }

  @media (max-width: 768px) {
    .marketplace-container {
      flex-direction: column;
       padding: 20% 20px;
    }

    .marketplace-container-content {
      width: 100%;
    }
      .listing-cards{
      padding: 10% 0px;}
  }
`}</style>

    </div>
  );
};

export default MarketplacePage;
