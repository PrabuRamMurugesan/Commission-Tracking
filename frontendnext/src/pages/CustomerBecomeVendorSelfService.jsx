

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const CustomerBecomeVendorSelfService = () => {
  const [onboardingStep, setOnboardingStep] = useState(3); // 1=Applied, 2=KYC Uploaded, 3=Approved, 4=Access Granted

  const steps = [
    'Applied',
    'KYC Uploaded',
    'Profile Approved',
    'Product Access Granted'
  ];

  return (
    <div className="vendor-self-service ">
      <Sidebar />
        {/* Main Content */}
        <div className=" main-content-cbvself">
          <h2 className="mb-4 text-center">Customer Become A Vendor – Self Service Portal</h2>

          {/* Onboarding Status Tracker */}
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h5>Vendor Onboarding Status</h5>
            </div>
            <div className="card-body">
              <div className="progress-container d-flex justify-content-between flex-wrap">
                {steps.map((step, idx) => (
                  <div key={idx} className="text-center flex-fill">
                    <div className={`circle ${onboardingStep >= idx + 1 ? 'bg-success' : 'bg-secondary'}`}>{idx + 1}</div>
                    <small>{step}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

         <div className='managemnet'> 
          
          {/* Vendor Profile Management */}
          <div className="card shadow mb-4">
            <div className="card-header bg-warning text-dark">
              <h5>Vendor Profile Management</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Mobile</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Store Name / Brand Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Vendor Bio / Tagline</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <button className="btn btn-warning mt-3 w-100">Save Profile</button>
              </form>
            </div>
          </div>

          {/* KYC Upload Section */}
          <div className="card shadow mb-4 ">
            <div className="card-header bg-success text-white">
              <h5>KYC Document Upload</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row ">
                  <div className="col-md-6">
                    <label className="form-label">Upload Aadhaar / PAN</label>
                    <input type="file" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Upload GST Certificate</label>
                    <input type="file" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cancelled Cheque</label>
                    <input type="file" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Business License (Optional)</label>
                    <input type="file" className="form-control" />
                  </div>
                </div>
               <button className="btn btn-success mt-3 w-100">Submit Documents</button>
                    </form>
            </div>
          </div></div>

          {/* Bank Info Setup */}
          <div className="card shadow ">
            <div className="card-header bg-info text-white">
              <h5>Bank / Wallet Setup</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Bank Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Account Number</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">IFSC Code</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">UPI ID</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <button className="btn btn-info mt-3 w-100">Save Bank Info</button>
              </form>
            </div>
          </div>
        </div>
      

      <style>{`
 .vendor-self-service{
  width: 100vw;
  height: 100vh; /* Full height of the screen */
  display: flex;
  flex-direction: row;
}

/* Sidebar should stretch fully */
.vendor-self-service > *:first-child {
  height: 100%;
}

/* Main content also full height and scrollable if needed */
.main-content-cbvself {
 
  padding: 20px;
  padding-bottom: 6%;
  height: 100%;
  overflow-y: auto; /* Allows scrolling if content overflows */
}
      }
       
      `}</style>
    </div>
  );
};

export default CustomerBecomeVendorSelfService;