//update 
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const EscrowPaymentsPage = () => {
  const [escrows] = useState([
    {
      id: 'ESC001',
      customer: 'Anjali Verma',
      vendor: 'Thia Jewels',
      platform: 'BBSCART',
      purpose: 'EMI Purchase',
      total: 18200,
      released: 10920,
      pending: 7280,
      status: 'Partially Released',
      trigger: '60% on Delivery, 40% after EMI clearance'
    },
    {
      id: 'ESC002',
      customer: 'Ramesh Iyer',
      vendor: 'Golldex Vault',
      platform: 'Golldex',
      purpose: 'Investment Lock-In',
      total: 10000,
      released: 0,
      pending: 10000,
      status: 'Pending',
      trigger: 'Release after 3-month Lock-In'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState(null);

  const handleView = (escrow) => {
    setSelectedEscrow(escrow);
    setShowModal(true);
  };

  return (
    <>
      <div className="scrow-payments-page ">
        
      <Sidebar />
          {/* Main Content */}
          <div className=" escrow-payments-containers">
            <h2 className="mb-4">Escrow Payments</h2>

            {/* Search & Filters Section */}
            <div className="card mb-4 p-3 search-filters">
              <h5 className="mb-3">🔍 Search & Filters</h5>
              <div className="row g-3">
                <div className="col-md-3 p-1">
                  <label>Date Range</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-3">
                  <label>Platform</label>
                  <select className="form-control">
                    <option>All</option>
                    <option>BBSCART</option>
                    <option>Golldex</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>Status</label>
                  <select className="form-control">
                    <option>All</option>
                    <option>Pending</option>
                    <option>Released</option>
                    <option>Disputed</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>Trigger</label>
                  <select className="form-control">
                    <option>All</option>
                    <option>Delivery</option>
                    <option>KYC</option>
                    <option>Investment</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>Customer/Vendor Name</label>
                  <input type="text" className="form-control" placeholder="Search name..." />
                </div>
                <div className="col-md-3">
                  <label>Transaction Type</label>
                  <select className="form-control">
                    <option>All</option>
                    <option>Order</option>
                    <option>Investment</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card shadow ">
              <div className="card-header bg-primary text-white">
                <h5>Escrow Transaction Summary</h5>
              </div>
              <div className="card-body ets-tab">
                <table className="table table-bordered table-hover ">
                  <thead>
                    <tr>
                      <th>Escrow ID</th>
                      <th>Customer</th>
                      <th>Vendor</th>
                      <th>Platform</th>
                      <th>Purpose</th>
                      <th>Total Amount(₹)</th>
                      <th>Released (₹)</th>
                      <th>Pending (₹)</th>
                      <th>Status</th>
                      <th>Release Trigger</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escrows.map((esc) => (
                      <tr key={esc.id}>
                        <td>{esc.id}</td>
                        <td>{esc.customer}</td>
                        <td>{esc.vendor}</td>
                        <td>{esc.platform}</td>
                        <td>{esc.purpose}</td>
                        <td>{esc.total}</td>
                        <td className="text-success">₹{esc.released}</td>
                        <td className="text-danger">₹{esc.pending}</td>
                        <td>
                          <span className={`badge bg-${esc.status === 'Released' ? 'success' : esc.status === 'Partially Released' ? 'warning' : 'secondary'}`}>
                            {esc.status}
                          </span>
                        </td>
                        <td>{esc.trigger}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleView(esc)}>View</button>
                          <button className="btn btn-sm btn-outline-danger">Dispute</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        

        {/* Escrow Details Modal */}
        {showModal && selectedEscrow && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">Escrow Details - {selectedEscrow.id}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Breakdown:</strong> ₹{selectedEscrow.total} Total, ₹{selectedEscrow.released} Released, ₹{selectedEscrow.pending} Pending</p>
                  <p><strong>Linked ID:</strong> #{selectedEscrow.id}</p>
                  <p><strong>Timeline:</strong> Held on Mar 15, Released on Mar 20</p>
                  <p><strong>Trigger:</strong> {selectedEscrow.trigger}</p>
                  <hr />
                  <button className="btn btn-sm btn-success me-2">Manual Release</button>
                  <button className="btn btn-sm btn-secondary">Download Receipt</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
           .scrow-payments-page{
          display: flex;
          flex-direction:row;
          flex-wrap:wrap;
          width: 100vw;
        }
          .escrow-payments-containers{
          flex: 1;
          padding: 5% 20px;
          }

          @media (max-width: 768px){
         

            .escrow-payments-containers{
            width: 100%;
              padding: 25% 12px;
            }
              .ets-tab{
              width: 100%;
              overflow-x: scroll;
          }
              .sidebar{
              display: block;}
              
          }
`}</style>
      </div>
    </>
  );
};

export default EscrowPaymentsPage;
