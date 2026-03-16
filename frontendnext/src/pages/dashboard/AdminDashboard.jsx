import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import axiosInstance from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

// Establish Socket.IO connection
const socket = io("/");

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [realTimeSales, setRealTimeSales] = useState([]); // For real-time sales updates

  // Fetch initial overview data from the backend
  useEffect(() => {
    axios
      .get("/api/dashboard/admin-overview")
      .then((response) => setOverview(response.data))
      .catch((error) => console.error("Error fetching admin overview:", error));
  }, []);

  // Real-time updates listener
  useEffect(() => {
    socket.on("update-dashboard", (newSale) => {
      console.log("Real-time sale received:", newSale);
      setRealTimeSales((prevSales) => [...prevSales, newSale]);
    });

    // Cleanup on component unmount
    return () => socket.off("update-dashboard");
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main d-flex justify-content-center row         ">
        <h1>Admin Dashboard</h1>

        <p>Total Sales: {overview.totalSales}</p>
        <p>Commission Earned: {overview.totalCommissions}</p>
        <p>Total Commissions:{overview.totalCommissions}</p>
        <p>Pending Commissions: {overview.pendingCommissions}</p>
        <p>Total Payouts: {overview.totalPayouts}</p>

        <h2>Top Agents</h2>
        <ul>
          {overview.topAgents?.map((agent) => (
            <li key={agent.agentId}>
              {agent.agentDetails?.name || "N/A"} - Sales: {agent.totalSales}
            </li>
          ))}
        </ul>

        <h2>Real-Time Sales Updates</h2>
        <ul>
          {realTimeSales.map((sale, index) => (
            <li key={index}>
              Product: {sale.productName}, Amount: {sale.saleAmount}
            </li>
          ))}
        </ul>
      </div>
      <style>
        {`
       .dashboard-container {
          display: flex; /* Align Sidebar and Content in a row */
          flex-direction: row; /* Row layout */
          justify-content: center;
          width: 100%;
          height: 100vh;
          background-color: #f9f9f9;

          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-family: 'Arial, sans-serif';
          color: #333;
  
          box-sizing: border-box;
}
            .dashboard-main{
             border: 3px solid #ccc;}

/* Sidebar */
          .sidebar {
            width: 250px;
            background-color: #2c3e50;
           color: white;
            padding: 20px;
}

/* Dashboard Content */
.dashboard-main {
  
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 100vh; /* To prevent overflow */
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction:row; /* Stack vertically on small screens */
    
  }

  .sidebar {
    width: 100%;
    padding: 10px;
  }

  .dashboard-main {
    padding: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default AdminDashboard;
