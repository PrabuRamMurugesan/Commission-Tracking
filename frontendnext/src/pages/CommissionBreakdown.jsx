import React from 'react';
import Sidebar from '../components/Sidebar';
// import '../styles/CommissionBreakdownPage.scss';

const CommissionBreakdownPage = () => {
  return (
    <div className="commission-breakdown-page">  
         <Sidebar />
        {/* Main Content */}
       
          <div className="commission-breakdown-main">
            <h2 className="mb-4">Commission Breakdown Dashboard</h2>

            {/* Summary Cards */}
            <div className="commission-breakdown-cards ">
              {[
                { title: "Total Commission Earned", value: "₹1,20,000", color: "primary" },
                { title: "Paid Commissions", value: "₹95,000", color: "success" },
                { title: "Pending Commissions", value: "₹25,000", color: "warning" },
                { title: "Golldex-related commission", value: "₹15,000", color: "info" },
                { title: "BBSCART-specific commission", value: "₹15,000", color: "info" },
              ].map((item, idx) => (
                <div className="col-md-6 col-lg-3" key={idx}>
                  <div className={`card border-${item.color} shadow`}>
                    <div className="card-body">
                      <h5>{item.title}</h5>
                      <h3 className={`text-${item.color}`}>{item.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="d-flex justify-content-between mb-4 px-4 overflow-auto gap-3">
              <label>Date Range: <input type="date" /></label>
              <label>Role:
                <select>
                  <option>All</option>
                  <option>Franchisee</option>
                  <option>Agent</option>
                  <option value="">Territory</option>
                  <option value="">Vendor</option>
                  <option value="">Customer Become a Vendor</option>
                  <option value="">Admin</option>
                </select>
              </label>
              <label>Status:
                <select>
                  <option>All</option>
                  <option>Paid</option>
                  <option>Pending</option>
                </select>
              </label>
              <label>Platform:
                <select>
                  <option>BBSCART</option>
                  <option>Golldex</option>
                </select>
              </label>
            </div>

            {/* Commission Table */}
            <div className="card shadow mb-4">
              <div className="card-header bg-primary text-white">
                <h5>Detailed Commission Log</h5>
              </div>
              <div className="card-body align-items-start text-nowrap overflow-auto">
                <table className="table table-hover">
                  <thead >
                    <tr>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>User Role</th>
                      <th>User Name</th>
                      <th>Commission Type</th>
                      <th>Transaction Amount</th>
                      <th>Commission % / Fixed Value</th>
                      <th>Commission Earned</th>
                      <th>Payment Status</th>
                      <th>Payout Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((id) => (
                      <tr key={id}>
                        <td>2025-04-01</td>
                        <td>TXN{id}5342</td>
                        <td>Agent</td>
                        <td>User{id}</td>
                        <td>Product Sale</td>
                        <td>₹{1000 * id}</td>
                        <td>5%</td>
                        <td>₹{50 * id}</td>
                        <td><span className="badge bg-success">Paid</span></td>
                        <td>2025-04-05</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">View Slip</button>
                          <button className="btn btn-sm btn-outline-secondary">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      
      
      <style>{`
       .commission-breakdown-page{
       display: flex;
        width: 100vw;
        height: 100vh;
       }
       .commission-breakdown-main{
       width: 100%;
       height: 100%;
       padding: 6% 20px;
       overflow-y: scroll;
       }
       .commission-breakdown-cards{
       display: flex;
       justify-content: center;
       flex-wrap: wrap;
       column-gap: 20px;
       row-gap: 20px;    
       margin-bottom: 30px;
       
       }
       @media (max-width: 768px) {
         .commission-breakdown-main{
          padding: 7rem 10px;          
         }
       }
       `}</style>
    </div>
  );
};

export default CommissionBreakdownPage;
