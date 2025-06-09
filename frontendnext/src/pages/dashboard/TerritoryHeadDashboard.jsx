// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const TerritoryHeadDashboard = () => {
//   const { territoryHeadId } = useParams();
//   const [data, setData] = useState({});

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/dashboard/territory/${territoryHeadId}`)
//       .then(response => setData(response.data))
//       .catch(error => console.error('Error fetching territory head dashboard:', error));
//   }, [territoryHeadId]);

//   return (
//     <div>
//       <h1>Territory Head Dashboard</h1>
//       <p>Total Sales: {data.totalSales}</p>
//       <p>Total Commissions: {data.totalCommissions}</p>
//     </div>
//   );
// };

// export default TerritoryHeadDashboard;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const TerritoryHeadDashboard = () => {
  const { territoryHeadId } = useParams();
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalCommissions: 0,
    agentList: [],
  });

  useEffect(() => {
    axiosInstance
      .get(`/dashboard/territory/${territoryHeadId}`)
      .then((response) => setDashboardData(response.data))
      .catch((error) =>
        console.error("Error fetching territory head dashboard:", error)
      );
  }, [territoryHeadId]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <div className=" row pb-4 ">
          <h1 className="dashboard-title">Territory Head</h1>
          {dashboardData && (
            <>
              <div className="col-md-3 ">
                <div className="card text-white bg-primary shadow">
                  <div className="card-body">
                    <h5>Total Sales</h5>
                    <h3>₹ {dashboardData.totalSales}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-white bg-success shadow">
                  <div className="card-body">
                    <h5>Commission Earned</h5>
                    <h3>₹ {dashboardData.totalCommission}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-white bg-warning shadow">
                  <div className="card-body">
                    <h5>Pending Commission</h5>
                    <h3>₹ {dashboardData.pendingCommission}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-success shadow">
                  <div className="card-body">
                    <h5>Total Withdrawn</h5>
                    <h3>₹{dashboardData.totalWithdrawn}</h3>
                  </div>
                </div>
              </div>

              {/* === ADDITIONAL SECTION: Payout Summary === */}
              {/* {dashboardData && (
          <div className=" g-3 mb-4">
            <div className="md-6">
              <div className="card border-success shadow">
                <div className="card-body">
                  <h5>Total Withdrawn</h5>
                  <h4>₹ {dashboardData.totalWithdrawn}</h4>
                </div>
              </div>
            </div>
          </div>
        )} */}
            </>
          )}
        </div>

        {/* === Agent Table === */}
        <div className="card  p-1 shadow">
          <div className="card-header bg-light d-flex justify-content-between">
            <h5 className=" mb-0 pt-2 p-1 text-nowrap">👥 Agent List</h5>
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
                  <th style={{ width: "10%", textAlign: "center" }}>Name</th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Agent ID
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Contact.No
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Territory Head
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Customers
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>Sales</th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Commission
                  </th>
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
            <h5 className="mb-0 text-nowrap  pt-2 p-1">👥 Vendor List</h5>
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
                  <th style={{ width: "10%", textAlign: "center" }}>Name</th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Agent ID
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Contact.No
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Territory Head
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Customers
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>Sales</th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Commission
                  </th>
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
          <div className="card-header bg-light">
            <h5 className="mb-0 text-nowrap p-1">👤 Customer List</h5>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%", textAlign: "center" }}>Name</th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Customer ID
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>Agent</th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Phone.No
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Last Purchase
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Transactions
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Total Spent
                  </th>
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
            <h5 className="mb-0 text-nowrap p-1 ">💳 Transactions</h5>
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
                  <th style={{ width: "10%", textAlign: "center" }}>
                    Customer
                  </th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Customer ID
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Phone.No
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>Amount</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Date</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Status</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Source</th>
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
      .dashboard-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.dashboard-main {
  padding: 6% 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f8f9fa;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

/* Table cell alignment */
.table th, .table td {
  vertical-align: middle;
  text-align: center;
}

/* Search & Filter Section */
.card-header input[type="text"],
.card-header select {
  border: 1px solid #ced4da;
  border-radius: 4px;
}

/* Responsive card grid */
@media (max-width: 768px) {
  .col-md-3 {
    margin-bottom: 1rem;
    width: 100%;
  }

  .dashboard-main {
    padding: 8rem 20px;
  }
    .card-body, .card-header{
    overflow-x: scroll;
    }
}
 `}
      </style>
    </div>
  );
};

export default TerritoryHeadDashboard;
