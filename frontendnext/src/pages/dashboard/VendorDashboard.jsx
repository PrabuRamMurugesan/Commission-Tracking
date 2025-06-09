import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const VendorDashboard = () => {
  const { vendorId } = useParams();
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalCommissions: 0,
    salesHistory: [],
  });

  useEffect(() => {
    axiosInstance
      .get(`/dashboard/vendor/${vendorId}`)
      .then((response) => setDashboardData(response.data))
      .catch((error) =>
        console.error("Error fetching vendor dashboard:", error)
      );
  }, [vendorId]);

  return (
    <div className="dashboard-vendor-container">
      <Sidebar />

      <div className="dashboard-vendor-content">
        <h1 className="dashboard-vendor-title">Vendor Dashboard</h1>

        <div className="dashboard-vendor-stat">
          <h3>Total Sales</h3>
          <p>{dashboardData.totalSales}</p>
        </div>
        <div className="dashboard-stat">
          <h3>Total Commissions</h3>
          <p>{dashboardData.totalCommissions}</p>
        </div>

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
      <style>
        {`
         .dashboard-vendor-container {
          display: flex;
          width: 100vw;
          height: 100vh;
        }

        .dashboard-vendor-content {
          width: 100%;
          height: 100%;
          padding:7% 20px;
        }

        .dashboard-vendor-title{
         text-decoration: underline;
         text-underline-offset: 8px;
         text-decoration-thickness: 3px;
          text-decoration-color:gray;
         text-align: center;
         margin-bottom: 20px;
         padding-left: 20px; 
        }

        .dashboard-vendor-stat {
          background-color: #eaf8ff;
          border: 1px solid #b3d4fc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: start;
                    display: flex;
          justify-content: space-between;
          align-items: center;
          align-content: center;
        }

        .dashboard-stat {
          background-color: #eaf8ff;
          border: 1px solid #b3d4fc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: start;
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-content: center;
        }

        .section-title {
          text-decoration: underline;
          text-underline-offset: 8px;
          text-decoration-thickness: 3px;
          text-decoration-color:gray;
          text-align: center;
          margin-bottom: 20px;
        }
        
`}
      </style>
    </div>
  );
};

export default VendorDashboard;
