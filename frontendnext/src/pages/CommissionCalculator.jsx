


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const CommissionCalculatorPage = () => {
  const [amount, setAmount] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState(null);

  const calculateCommission = (e) => {
    e.preventDefault();

    let commissionRate = 0;
    if (role === 'Franchise') commissionRate = 0.05;
    else if (role === 'Agent') commissionRate = 0.03;
    else if (role === 'Territory Head') commissionRate = 0.02;
    else if (role === 'Vendor') commissionRate = 0.04;
    else if (role === 'CustomerBecomeAVendor') commissionRate = 0.025;

    const commission = amount * commissionRate;
    const bonus = commission >= 10000 ? commission * 0.05 : 0;
    const total = commission + bonus;

    setResult({ commission, bonus, total });
  };

  return (
    <div className="commission-calc-page">
      <Sidebar />
     {/* Main Content */}
      <div className="commission-calc-main">
        <h2 className="mb-4">Commission Calculator</h2>

        {/* Commission Form */}
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={calculateCommission}>
              <div className="row">
                {/* User Role Selection */}
                <div className="col-md-4 mb-3">
                  <label>User Role</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    <option value="Franchise">Franchise</option>
                    <option value="Territory Head">Territory Head</option>
                    <option value="Agent">Agent</option>
                    <option value="Vendor">Vendor</option>
                    <option value="CustomerBecomeAVendor">Customer Become A Vendor</option>
                  </select>
                </div>

                {/* Transaction Amount Input */}
                <div className="col-md-4 mb-3">
                  <label>Transaction Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

        

                <div className="col-md-4 mb-3">
                  <label>Commission Type (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Date Range or Period(₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Additional Bonus(₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />    
                </div>

                

                {/* Submit Button */}
                <div className="col-md-4 d-flex align-items-end mb-3">
                  <button type="submit" className="btn btn-success w-100">
                    Calculate Commission
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5>Commission Breakdown</h5>
            </div>
            <div className="card-body">
              <p><strong>Base Commission:</strong> ₹{result.commission.toFixed(2)}</p>
              <p><strong>Bonus:</strong> ₹{result.bonus.toFixed(2)}</p>
              <p><strong>Total Estimated Commission:</strong> ₹{result.total.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    
 

  <style>{`
   .commission-calc-page{
   display: flex;
   width: 100vw;
   height: 100vh;
   }
   .commission-calc-main{
   width: 100%;
   padding: 7% 25px;
   }
   @media (max-width: 768px) {
    .commission-calc-main {
      padding: 7rem 10px;
    }
   }
  `}</style>
</div>

  );
};

export default CommissionCalculatorPage;
