// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';

// const ReferralDashboard = () => {
//   const { userId } = useParams();
//   const [dashboardData, setDashboardData] = useState({
//     totalReferralBonus: 0,
//     referredUsers: []
//   });

//   useEffect(() => {
//     axiosInstance.get(`/dashboard/referral/${userId}`)
//       .then(response => setDashboardData(response.data))
//       .catch(error => console.error('Error fetching referral dashboard:', error));
//   }, [userId]);

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-title">Referral Dashboard</h1>

//       <div className="dashboard-stat">
//         <h3>Total Referral Bonus</h3>
//         <p>{dashboardData.totalReferralBonus}</p>
//       </div>

//       <h2 className="section-title">Referred Users</h2>
//       <ul className="data-list">
//         {dashboardData.referredUsers.map((user, index) => (
//           <li key={index}>
//             <span>Name:</span> {user.name}, <span>Email:</span> {user.email}, <span>Role:</span> {user.role}
//           </li>
//         ))}
//       </ul>
//       <style>
//         {`
//         body {
//   font-family: 'Arial, sans-serif';
//   background-color: #f4f5f7;
//   margin: 0;
//   padding: 0;
// }

// .dashboard-container {
//   max-width: 800px;
//   margin: 50px auto;
//   padding: 20px;
//   background-color: #ffffff;
//   border-radius: 10px;
//   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
// }

// .dashboard-title {
//   text-align: center;
//   color: #333;
//   font-size: 28px;
//   margin-bottom: 20px;
// }

// .dashboard-stat {
//   background-color: #eaf8ff;
//   border: 1px solid #b3d4fc;
//   padding: 15px;
//   border-radius: 8px;
//   margin-bottom: 20px;
//   text-align: center;
// }

// .dashboard-stat h3 {
//   color: #007bff;
//   font-size: 20px;
//   margin: 0;
// }

// .dashboard-stat p {
//   font-size: 24px;
//   font-weight: bold;
//   margin-top: 5px;
//   color: #333;
// }

// .section-title {
//   font-size: 22px;
//   color: #555;
//   margin-bottom: 10px;
// }

// .data-list {
//   list-style: none;
//   padding: 0;
// }

// .data-list li {
//   background-color: #f9f9f9;
//   padding: 15px;
//   margin-bottom: 10px;
//   border: 1px solid #e0e0e0;
//   border-radius: 8px;
// }

// .data-list li span {
//   font-weight: bold;
//   color: #333;
// }

// @media (max-width: 768px) {
//   .dashboard-container {
//     padding: 15px;
//   }

//   .dashboard-title {
//     font-size: 24px;
//   }

//   .dashboard-stat h3 {
//     font-size: 18px;
//   }

//   .dashboard-stat p {
//     font-size: 20px;
//   }

//   .section-title {
//     font-size: 20px;
//   }
// }
// `}
//       </style>
//     </div>
//   );
// };

// export default ReferralDashboard;

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const ReferralBonusPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [bonusSummary, setBonusSummary] = useState({
    totalReferrals: 0,
    totalBonus: 0,
    pendingBonus: 0,
  });

  useEffect(() => {
    // Replace with actual API call
    const fetchedReferrals = [
      { name: 'John Doe', date: '2024-10-10', status: 'Approved', bonus: 500 },
      { name: 'Jane Smith', date: '2024-10-12', status: 'Pending', bonus: 300 },
    ];
    setReferrals(fetchedReferrals);

    const totalBonus = fetchedReferrals.reduce((sum, r) => sum + r.bonus, 0);
    const pendingBonus = fetchedReferrals
      .filter((r) => r.status === 'Pending')
      .reduce((sum, r) => sum + r.bonus, 0);

    setBonusSummary({
      totalReferrals: fetchedReferrals.length,
      totalBonus,
      pendingBonus,
    });
  }, []);

  return (
    <div className="referral-page">
    <Sidebar/>
      <div className="referral-dashboards ">
        <h2 className="mb-4">Referral Bonus Dashboard</h2>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Referrals</h5>
                <p className="card-text">{bonusSummary.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Bonus Earned</h5>
                <p className="card-text">₹{bonusSummary.totalBonus}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Pending Bonus</h5>
                <p className="card-text">₹{bonusSummary.pendingBonus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Table */}
        <div className="card shadow">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Referral Bonus Details</h5>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Bonus (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref, index) => (
                  <tr key={index}>
                    <td>{ref.name}</td>
                    <td>{ref.date}</td>
                    <td>
                      <span className={`badge ${ref.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {ref.status}
                      </span>
                    </td>
                    <td>{ref.bonus}</td>
                    <td>
                      {ref.status === 'Pending' && (
                        <button className="btn btn-sm btn-outline-success">Approve</button>
                      )}
                      {ref.status === 'Approved' && (
                        <button className="btn btn-sm btn-outline-secondary" disabled>
                          Approved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {referrals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No referrals yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     <style>
      {`
      .referral-page{
      display: flex;
      width: 100vw;
      height: 100vh;
      }
      .referral-dashboards{
      padding: 7% 20px;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      }
      @media (max-width: 768px) {
        .referral-dashboards {
          padding: 7rem 10px;
        }
      }`}
     </style>
    </div>
  );
};

export default ReferralBonusPage;
