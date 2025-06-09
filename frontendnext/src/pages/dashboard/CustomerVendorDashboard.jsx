import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const CustomerVendorDashboard = () => {
  const { customerId } = useParams();
  const [dashboardData, setDashboardData] = useState({
    vendorDetails: {},
    totalSales: 0,
    salesHistory: [],
  });

  useEffect(() => {
    axiosInstance
      .get(`/dashboard/customer-vendor/${customerId}`)
      .then((response) => setDashboardData(response.data))
      .catch((error) =>
        console.error("Error fetching customer vendor dashboard:", error)
      );
  }, [customerId]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main-customervendor">
        <div className="main-dashboard row">
          <h1 className="">Customer Dashboard</h1>

          {dashboardData && (
            <>
              <div className="col-md-3 CVD-box">
                <div className="card text-white bg-primary shadow">
                  <div className="card-body">
                    <h5>Total Sales</h5>
                    <h3>₹ {dashboardData.totalSales}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 CVD-box">
                <div className="card text-white bg-success shadow">
                  <div className="card-body" style={{ color:"black"}}>
                    <h5>Commission Earned</h5>
                    <h3>₹ {dashboardData.totalCommission}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 CVD-box">
                <div className="card text-white bg-warning shadow">
                  <div className="card-body " style={{ color:"black"}}>
                    <h5>Pending Commission</h5>
                    <h3>₹ {dashboardData.pendingCommission}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3 CVD-box">
                <div className="card text-white bg-success shadow">
                  <div className="card-body" style={{color:"black"}}>
                    <h5>TotalWithdrawn</h5>
                    <h3>₹{dashboardData.totalWithdrawn}</h3>
                  </div>
                </div>
              </div>

              {/* === ADDITIONAL SECTION: Payout Summary === */}
              {dashboardData && (
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
        )}
            </>
          )}
        </div>
        {/* === Customer Table === */}
        <div className="card mb-4 shadow ">
          
          <div className="card-header bg-light  ">     
          <h5 className="mb-0">Customer</h5></div> 
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
            <h5 className="mb-0 text-nowrap pe-2 pt-1">💳 Transactions</h5>
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
          <div className="card-body customer-tables-vendor overflow-auto">
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

         <div className="customer-tables-vendor">
         <div className="dashboard-stat ">
            <h3>Total Sales</h3>
            <p>{dashboardData.totalSales}</p>
          </div>

          <h2 className="section-title ">Vendor Details</h2>
          <ul className="data-list p-3">
            <li>
              <span>Name:</span> {dashboardData.vendorDetails.name || "N/A"}
            </li>
            <li>
              <span>Email:</span> {dashboardData.vendorDetails.email || "N/A"}
            </li>
          </ul>

          <h2 className="section-title">Sales History</h2>
          <ul className="data-list">
            {dashboardData.salesHistory.map((sale, index) => (
              <li key={index}>
                <span>Product:</span> {sale.productName}, <span>Amount:</span>{" "}
                {sale.saleAmount}, <span>Date:</span>{" "}
                {new Date(sale.saleDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
         </div>
        </div>
        <style>
          {`
       .dashboard-container {
         display: flex;
         flex-direction: row;
         width: 100vw;
         height: 100vh;
       }
       
       .dashboard-main-customervendor{
     
          padding: 6% 25px;
          width: 100%;
          height: 100%;
          overflow-y: scroll;
        }
         .main-dashboard {
         padding-bottom: 20px;
           }
         .customer-tables-vendor{
         padding: 20px;
         }
         .customer-tables-vendor{
          border: 1px solid #ccc;
         }

         @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          .dashboard-main-customervendor{
            padding: 7rem 25px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
          }
            .CVD-box{
              padding: 1rem 10px ;
            }
          }
            .card-header
            {
             overflow-x: scroll;
            }
       

            `}
        </style>
      </div>
    </div>
  );
};

export default CustomerVendorDashboard;
