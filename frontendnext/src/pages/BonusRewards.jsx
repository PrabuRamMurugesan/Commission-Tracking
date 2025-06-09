import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const BonusRewardsPage = () => {
  return (
    <div className="bonus-page">
     <Sidebar />
      <div className="bonus-page-main">
        <h2 className="mb-4">Bonus and Rewards Dashboard</h2>

        {/* Quick Overview Cards */}
        <div className="row g-4 mb-4 w-100">
          {[{"title":"Total Rewards","value":350,"color":"primary"},
            {"title":"Pending Rewards","value":50,"color":"warning"},
            {"title":"Distributed Rewards","value":300,"color":"success"},
            {"title":"Top Performers","value":"5 Users","color":"info"}].map((item, idx) => (
            <div className="col-md-3" key={idx}>
              <div className={`card border-${item.color} shadow`}>
                <div className="card-body">
                  <h5>{item.title}</h5>
                  <h3 className={`text-${item.color}`}>{item.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reward Allocation Section */}
        <div className="card shadow mb-4">
         
          <div className="card-header bg-success text-white">
            <h5>Allocate Rewards</h5>
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label>User Type</label>
                  <select className="form-select">
                    <option>Franchise</option>
                    <option>Territory Head</option>
                    <option>Agent</option>
                    <option>Vendor</option>
                    <option>Customer</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Reward Type</label>
                  <select className="form-select">
                    <option>Monetary</option>
                    <option>Loyalty Points</option>
                    <option>Commission</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Amount/Points</label>
                  <input type="number" className="form-control" placeholder="Enter amount" />
                </div>
                <div className="col-md-3 d-flex align-items-end mb-3">
                  <button type="submit" className="btn btn-success w-100">Allocate</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Reward History Table */}
        <div className="card shadow">
          <div className="card-header bg-info text-white">
            <h5>Rewards History</h5>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>User Type</th>
                  <th>Reward Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4].map((idx) => (
                  <tr key={idx}>
                    <td>2025-04-01</td>
                    <td>User{idx}</td>
                    <td>Agent</td>
                    <td>Loyalty Points</td>
                    <td><span className="badge bg-success">Distributed</span></td>
                    <td>
                      <button className="btn btn-sm btn-primary">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .bonus-page {
        display: flex;
        width: 100vw;
        height: 100vh;
          }

        .bonus-page-main {    
         width: 100%;
         height: fit-content;
         padding: 6% 25px;
        }
        @media (max-width: 768px) {
          .bonus-page-main {
            padding: 8rem 10px;
          }

      `}</style>
    </div>
  );
};

export default BonusRewardsPage;
 

