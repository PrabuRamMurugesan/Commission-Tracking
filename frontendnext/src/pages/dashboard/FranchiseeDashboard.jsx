

//Following code been update on 26.03.2025 (afternoon 16.29)

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";
import axios from "axios";

const FranchiseeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const { id: userId, role } = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`/dashboard?userId=${userId}&role=${role}`)
      .then((res) => setDashboardData(res.data))
      .catch((err) => console.error("Dashboard error", err));
  }, []);
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main ">
        {/* Stats Cards */}
        
        <div className="row g-3 mb-4">
      <h1>Franchisee Dashboard</h1>
          {dashboardData && (
            <>
              <div className="col-md-4">
                <div className="card text-white bg-primary shadow">
                  <div className="card-body">
                    <h5>Total Sales</h5>
                    <h3>₹ {dashboardData.totalSales}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white bg-success shadow">
                  <div className="card-body">
                    <h5>Commission Earned</h5>
                    <h3>₹ {dashboardData.totalCommission}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white bg-dark shadow">
                  <div className="card-body">
                    <h5>Pending Commission</h5>
                    <h3>₹ {dashboardData.pendingCommission}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white bg-info shadow">
                  <div className="card-body">
                    <h5>Territory Heads</h5>
                    <h3>{dashboardData.territoryHeadsCount}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white bg-warning shadow">
                  <div className="card-body">
                    <h5>Agents</h5>
                    <h3>{dashboardData.agentsCount}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white bg-secondary shadow">
                  <div className="card-body">
                    <h5>Customers</h5>
                    <h3>{dashboardData.customersCount}</h3>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* === ADDITIONAL SECTION: Payout Summary === */}
        {dashboardData && (
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-success shadow">
                <div className="card-body">
                  <h5>Total Withdrawn</h5>
                  <h4>₹ {dashboardData.totalWithdrawn}</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Territory Head Table === */}
        <div className="card mb-4 shadow">
          <div className="card-header bg-light d-flex justify-content-between">
            <h5 className="mb-0 text-nowrap pe-3">📍 Territory Head List</h5>
            <div className="d-flex align-items-center column-gap-2  ">
              <input className="p-1" type="text" search placeholder="search" />
              <select className="p-1">
                <option value="sort" disabled selected>
                  Select a sort option
                </option>
                <option value="name">Name</option>
                <option value="date">Territory Head ID</option>
                <option value="price">Assigned Agents</option>
              </select>

              <select className="p-1">
                <option value="filter" disabled selected> 
                  Select a filter option
                </option>
                <option value="name">Name</option>
                <option value="date">Agent ID</option>
                <option value="price">Territory Head</option>
              </select>
            </div>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Name</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>Territory Head ID</th>
                  <th style={{ width: '15%' , textAlign: 'center' }}>Contact.No</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Email</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Assigned Agents</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Sales</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Commission</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.territoryHeadsList?.map((th, index) => (
                  <tr key={index}>
                    <td>{th.name}</td>
                    <td>{th.email}</td>
                    <td>{th.assignedAgents}</td>
                    <td>₹ {th.sales}</td>
                    <td>₹ {th.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === Agent Table === */}
        <div className="card mb-4 shadow">
          <div className="card-header bg-light d-flex justify-content-between">
            <h5 className=" text-nowrap pe-3 pt-2">👥 Agent List</h5>
            <div className="d-flex align-items-center column-gap-2 pt-2">
              <input className="p-1" type="text" search placeholder="search" />

              <select className="p-1">
                <option value="sort" disabled selected>
                  Select a sort option
                </option>
                <option value="name">Sort by Name</option>
                <option value="date">Agent ID</option>
                <option value="price">Territory Head</option>
              </select>

              <select className="p-1">
                <option value="filter" disabled selected>
                  Select a filter option
                </option>
                <option value="name">Name</option>
                <option value="date">Agent ID</option>
                <option value="price">Territory Head</option>
              </select>
            </div>
          </div>
          <div className="card-body ">
            <table className="table table-bordered ">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Name</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>Agent ID</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Contact.No</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Territory Head</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Customers</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Sales</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Commission</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.agentsList?.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.name}</td>
                    <td>{agent.territoryHead}</td>
                    <td>{agent.customers}</td>
                    <td>₹ {agent.sales}</td>
                    <td>₹ {agent.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === Vendor Table === */}
        <div className="card mb-4 shadow">
          <div className="card-header bg-light d-flex justify-content-between">
            <h5 className="mb-0 text-nowrap pe-3 pt-2">👥 Vendor List</h5>
            <div className="d-flex align-items-center column-gap-2 pt-2">
              <input className="p-1" type="text" search placeholder="search" />

              <select className="p-1">
                <option value="sort" disabled selected>
                  Select a sort option
                </option>
                <option value="name">Sort by Name</option>
                <option value="date">Agent ID</option>
                <option value="price">Territory Head</option>
              </select>

              <select className="p-1">
                <option value="filter" disabled selected>
                  Select a filter option
                </option>
                <option value="name">Name</option>
                <option value="date">Agent ID</option>
                <option value="price">Territory Head</option>
              </select>
            </div>
          </div>
          <div className="card-body ">
            <table className="table table-bordered ">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Name</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>Agent ID</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Contact.No</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Territory Head</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Customers</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Sales</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Commission</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.agentsList?.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.name}</td>
                    <td>{agent.territoryHead}</td>
                    <td>{agent.customers}</td>
                    <td>₹ {agent.sales}</td>
                    <td>₹ {agent.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* === Customer Table === */}
        <div className="card mb-4 shadow">
          <div className="card-header bg-light d-flex justify-content-between">
            <h5 className="mb-0 text-nowrap pe-3">👤 Customer List</h5>
            <div className="d-flex align-items-center column-gap-2 ">
              <input className="p-1" type="text" search placeholder="search" />
              <select className="p-1">
                <option value="sort" disabled selected>
                  Transactions Sort
                </option>
                <option value="name">Name</option>
                <option value="date">Date</option>
              </select>

              <select className="p-1">
                <option value="filter" disabled selected> 
                  Transactions Filter
                </option>
                <option value="name">Name</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Name</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>Customer ID</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Agent</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Phone.No</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Last Purchase</th>  
                  <th style={{ width: '15%', textAlign: 'center' }}>Transactions</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.customerList?.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.name}</td>
                    <td>{customer.agent}</td>
                    <td>{customer.lastPurchase}</td>
                    <td>{customer.transactionCount}</td>
                    <td>₹ {customer.totalSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === Transaction Table (Optional) === */}
        <div className="card mb-4 shadow">
          <div className="card-header bg-light d-flex justify-content-between  ">
            <h5 className="mb-0 text-nowrap pe-3 pt-2">💳 Transactions</h5>
            <div className="d-flex align-items-center column-gap-2 ">
              <input className="p-1" type="text" search placeholder="search" />
              <select className="p-1">
                <option value="sort" disabled selected>
                  Transactions Sort
                </option>
                <option value="name">Name</option>
                <option value="date">Date</option>
              </select>

              <select className="p-1">
                <option value="filter" disabled selected> 
                  Transactions Filter
                </option>
                <option value="name">Name</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Customer</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>Customer ID</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Phone.No</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Amount</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Date</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.transactionList?.map((t, index) => (
                  <tr key={index}>
                    <td>{t.customer}</td>
                    <td>₹ {t.amount}</td>
                    <td>{t.date}</td>
                    <td>{t.status}</td>
                    <td>{t.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>
        {`
          /* Base Styles */
.dashboard-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.dashboard-main {
  padding: 6% 20px;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: scroll;
}
  .card-header{
 flex-wrap: wrap;
 overflow-x: scroll;
 padding: 10px;
  }
  .card-body {
    overflow-x: scroll;
    padding: 10px;
  }
  

  @media (max-width: 768px) {
    .dashboard-main {
      padding: 8rem 10px;
    }
      .card-header{
      padding: 10px;
  }
      .card-body {
        padding: 10px;
      }
  }
`}
      </style>
    </div>
  );
};

export default FranchiseeDashboard;

// import React, { useEffect, useState } from "react";
// import axios from "../api/axiosInstance";

// const FranchiseDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     const { id: userId, role } = JSON.parse(localStorage.getItem("user"));

//     axios
//       .get(`/dashboard?userId=${userId}&role=${role}`)
//       .then((res) => setDashboardData(res.data))
//       .catch((err) => console.error("Dashboard error", err));
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">Franchise Dashboard</h2>

//       {dashboardData && (
//         <>
//           <p>Agents: {dashboardData.agents.length}</p>
//           <p>Vendors: {dashboardData.vendors.length}</p>
//           <p>Customers: {dashboardData.customers.length}</p>
//           <p>Transactions: {dashboardData.transactions.length}</p>
//         </>
//       )}
//       <style>
//         {`
//         .dashboard-container {
//     max-width: 1200px;
//     margin: 0 auto;
//     padding: 20px;
//     background-color: #f9f9f9;
//     border-radius: 10px;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     font-family: 'Arial, sans-serif';
//     color: #333;
// }

// .dashboard-title {
//     text-align: center;
//     font-size: 28px;
//     font-weight: bold;
//     color: #2c3e50;
//     margin-bottom: 20px;
// }

// .dashboard-stat {
//     display: flex;
//     justify-content: space-between;
//     padding: 10px 20px;
//     background-color: #ffffff;
//     border: 1px solid #ddd;
//     border-radius: 5px;
//     margin-bottom: 10px;
// }

// .dashboard-stat h3 {
//     margin: 0;
//     color: #2980b9;
//     font-size: 18px;
// }

// .dashboard-stat p {
//     font-size: 16px;
//     color: #666;
// }

// .section-title {
//     font-size: 22px;
//     color: #34495e;
//     margin-top: 30px;
//     margin-bottom: 15px;
//     border-bottom: 2px solid #ddd;
//     padding-bottom: 5px;
// }

// .data-list {
//     list-style-type: none;
//     padding: 0;
//     margin: 0;
// }

// .data-list li {
//     background-color: #ffffff;
//     padding: 10px 15px;
//     border-radius: 5px;
//     border: 1px solid #ddd;
//     margin-bottom: 10px;
//     transition: all 0.3s ease;
// }

// .data-list li:hover {
//     background-color: #eaf2f8;
//     border-color: #3498db;
// }

// .data-list span {
//     font-weight: bold;
// }

// .dashboard-button {
//     padding: 10px 20px;
//     background-color: #3498db;
//     color: white;
//     border: none;
//     border-radius: 5px;
//     cursor: pointer;
//     font-size: 16px;
//     transition: all 0.3s ease;
// }

// .dashboard-button:hover {
//     background-color: #2980b9;
// }

// /* Responsive Design */
// @media (max-width: 768px) {
//     .dashboard-container {
//         padding: 10px;
//     }

//     .dashboard-stat {
//         flex-direction: column;
//         text-align: center;
//     }

//     .dashboard-stat h3 {
//         margin-bottom: 5px;
//     }

//     .dashboard-button {
//         width: 100%;
//         margin-top: 10px;
//     }
// }
// `}
//       </style>
//     </div>
//   );
// };

// export default FranchiseDashboard;
