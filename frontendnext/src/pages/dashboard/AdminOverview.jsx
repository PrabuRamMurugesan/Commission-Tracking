import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../api/axiosInstance';
import Sidebar from '../../components/Sidebar';

const AdminOverview = () => {
    const [chartData, setChartData] = useState([]);

    const [overviewData, setOverviewData] = useState({
    totalSales: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    totalPayouts: 0,
    topAgents: [],
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/admin-overview');
        setOverviewData(response.data);
        const formattedData = data.topAgents.map((agent) => ({
            name: agent.agentDetails.name,
            sales: agent.totalSales,
            }));
            setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching admin overview:', error);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="admin-overview-container">
  <Sidebar /> 
  
  <div className="admin-overview-main">
    <h1 className="dashboard-title">Admin Overview Dashboard</h1>
  
    <div className="admin-overview-stats">
      
    <div className="dashboard-stat" style={{ backgroundColor: '#007bff', color: 'white' }}>
      <h3>Total Sales</h3>
      <p>${overviewData.totalSales.toLocaleString()}</p>
    </div>

    <div className="dashboard-stat" style={{ backgroundColor: 'green', color: 'white' }}>
      <h3>Total Commissions</h3>
      <p>{overviewData.totalCommissions}</p>
    </div>

    <div className="dashboard-stat" style={{ backgroundColor: 'orange', color: 'white' }}>
      <h3>Pending Commissions</h3>
      <p>{overviewData.pendingCommissions}</p>
    </div>

    <div className="dashboard-stat" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
      <h3>Total Payouts</h3>
      <p>${overviewData.totalPayouts.toLocaleString()}</p>
    </div>
    </div>

    <h1>Admin Overview</h1>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
   
    <h2 className="section-title">Top Agents</h2>
    <ul className="data-list">
      {overviewData.topAgents.map((agent, index) => (
        <li key={index}>
          <span>Name:</span> {agent.agentDetails?.name || 'Unknown'}<br />
          <span>Total Sales:</span> ${agent.totalSales.toLocaleString()}
        </li>
      ))}
    </ul>
  </div>

  <style>
    {`
     .admin-overview-container {
      display: flex;
      width: 100vw;
      height: 100vh;
     } 
      .admin-overview-main {
      width: 100%;
      height: 100%;
      padding: 7% 20px;
      padding-bottom: 40px;
      overflow-x: scroll;
      overflow-y: scroll;
    }
      .admin-overview-stats {
        display: flex;
        Flex-direction: row;
        justify-content: start;
        flex-wrap: wrap;
        align-items: center;
        width: 100vw;
        height: fit-content;
        padding: 10px 20px;
        border-radius: 8px;
      }
        .dashboard-stat{
       
        align-items: center;
        text-align: center;
      
        border: 1px solid #e0e0e0;
        padding: 10px  20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin: 10px;
      }
    @media (max-width: 768px) {
      .admin-overview-container {
        flex-direction: column;
      }
      .admin-overview-main {
        padding: 8rem 20px;
      }
    .dashboard-stat{
        width: 90%;
        height: fit-content;
        border-radius: 8px;
        
      }
    }
    
    `}
  </style>
</div> 
  );
};

export default AdminOverview;
