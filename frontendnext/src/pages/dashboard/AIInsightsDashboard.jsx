// import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Sidebar from "../../components/Sidebar";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AIInsightsDashboard = () => {
  // Sales Forecast Data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Projected Sales ($)",
        data: [12000, 15000, 17000, 21000, 25000, 27000, 30000, 32000, 34000, 37000, 40000, 45000],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
      },
      {
        label: "Actual Sales ($)",
        data: [11000, 14000, 16000, 20500, 24000, 26000, 31000, 33000, 35000, 36000, 39000, 43000],
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="ai-insights-dashboard-container">
  
    <Sidebar />
 

  {/* Main Content */}
  <div className=" main-content-ai ">
    <h2 className="mb-4 text-primary">AI Insights & Sales Forecast</h2>

    {/* AI Insights Overview */}
    <div className="row g-3 p-0 pb-2">
      <div className="col-md-4">
        <div className="card border-info shadow ">
          <div className="card-body">
            <h5>AI Alerts</h5>
            <p className="text-danger">⚠️ 3 Fraud Detections</p>
            <p className="text-warning">📈 Sales Trend Increasing</p>
            <p className="text-success">✅ 85% Accurate Forecasts</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-success shadow h-100">
          <div className="card-body">
            <h5>Commission Trends</h5>
            <p>💰 Total Paid: <strong>$50,000</strong></p>
            <p>💼 Agent Earnings: <strong>$15,000</strong></p>
            <p>📉 Pending Commissions: <strong>$5,200</strong></p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-warning shadow h-100">
          <div className="card-body">
            <h5>Risk Analysis</h5>
            <p>⚠️ High-risk transactions: <strong>2</strong></p>
            <p>🔍 Suspicious Agents: <strong>1</strong></p>
            <p>📌 Manual Review Needed</p>
          </div>
        </div>
      </div>
    </div>

    {/* Sales Forecast Chart */}
    <div className=" card shadow mt-1">
      <div className="card-header bg-primary text-white">
        <h5>Sales Forecast (Next 12 Months)</h5>
      </div>
      <div className="line card-body">
        <Line data={salesData} />
      </div>
    </div>
  </div>
  <style>
    {`
      .ai-insights-dashboard-container{
        display: flex;
        width: 100vw;
        height: 100vh;
        }

       .main-content-ai {
         padding: 6% 35px;
         width: 100%;
         height: 100vh;
         overflow-y: scroll;
       } 
         @media (max-width: 768px) {
          .main-content-ai {
            padding: 8rem 15px;
    }
    `}
   
  </style>
</div>
);
};

export default AIInsightsDashboard;
