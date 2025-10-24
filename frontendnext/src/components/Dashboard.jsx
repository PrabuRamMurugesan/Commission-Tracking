// Import necessary dependencies
import React from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Header from "./Header";

// Register the chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardPage() {
  // Data for Bar Chart
  const barChartData = {
    labels: ["Purchase", "Sales", "Customers", "Vendors", "Products"],
    datasets: [
      {
        label: "Statistics",
        data: [17684, 6523, 12, 11, 25],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(54, 162, 235, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const navigate = useNavigate(); // Using the useNavigate hook

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Purchase & Sales Overview",
      },
    },
  };

  return (
    <div className="Dashboard-home">
      <Header />
      <Sidebar />
      <div className="main-dashboard">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap px-2">
          <h1 className="text-primary">Dashboard</h1>
          <div className="d-flex">
            <button
              className="btn btn-success mx-2"
              onClick={() => navigate("/signup")} // Navigate to English page
            >
              SignUp
            </button>
            <button
              className="btn btn-primary mx-2"
              onClick={() => navigate("/usermanagement")} // Navigate to POS page
            >
              User Management
            </button>
            <button
              className="btn btn-primary mx-2"
              onClick={() => navigate("/upload")} // Navigate to POS page
            >
              Bulk Product Upload
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => navigate("/")} // Navigate to Dashboard page
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card bg-info text-white text-center">
              <div className="card-body">
                <h5>Total Purchase Due</h5>
                <h3>-17684.50 $</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-warning text-white text-center">
              <div className="card-body">
                <h5>Total Sales Due</h5>
                <h3>-6523.00 $</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-success text-white text-center">
              <div className="card-body">
                <h5>Total Sales Amount</h5>
                <h3>529436.00 $</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-danger text-white text-center">
              <div className="card-body">
                <h5>Total Expense Amount</h5>
                <h3>62500.00 $</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card bg-pink text-black text-center">
              <div className="card-body">
                <h5>Customers</h5>
                <h3>12</h3>
                <button className="btn btn-light mt-2">View</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-purple text-black text-center">
              <div className="card-body">
                <h5>Suppliers</h5>
                <h3>11</h3>
                <button className="btn btn-light mt-2">View</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-teal text-black text-center">
              <div className="card-body">
                <h5>Purchase Invoice</h5>
                <h3>3</h3>
                <button className="btn btn-light mt-2">View</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-green text-black text-center">
              <div className="card-body">
                <h5>Sales Invoice</h5>
                <h3>11</h3>
                <button className="btn btn-light mt-2">View</button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row flex-wrap">
          <div className="col-md-8">
            <div className="bar-card">
              <div className="card-body">
                <h5>Purchase & Sales Bar Chart</h5>

                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
          <div className="recent-items-dash col ">
            <div className="card">
              <div className="card-body ">
                <h5>Recently Added Items</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sl. No</th>
                      <th>Item Name</th>
                      <th>Item Sales Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Test 1</td>
                      <td>13.20 $</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Test 2</td>
                      <td>14.16 $</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Test 3</td>
                      <td>9.36 $</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .Dashboard-home{
          width: 100vw;
          height: 100vh;
          display: flex;
          }
          
          .main-dashboard{
          width: 100%;
          height: 100%;
          padding: 7% 20px;
          overflow-y: scroll;
          }
          .bar-card{
        
          width: 680px;
          height: 100%;
          padding: 20px;
          }
         .recent-items-dash{
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         }
         @media (max-width: 768px) {
          .main-dashboard {
            padding: 7rem 10px;
          }
        }
        `}
      </style>
    </div>
  );
}

export default DashboardPage;

// import React, { useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   const [activeReport, setActiveReport] = useState(null);
//   const [viewType, setViewType] = useState('sales');  // Default to 'sales'

//   const reports = [
//     { title: 'Franchise Report', id: 'franchise', color: '#17a2b8' },
//     { title: 'Territory Head Report', id: 'territory', color: '#ffc107' },
//     { title: 'Agent Report', id: 'agent', color: '#28a745' },
//     { title: 'Customer Become Vendor', id: 'customerVendor', color: '#dc3545' },
//     { title: 'Vendor Report', id: 'vendor', color: '#DC7835' },
//   ];

//   const chartData = {
//     franchise: {
//       labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
//       datasets: [
//         {
//           label: 'Franchise Sales',
//           data: [10, 11, 10, 25, 20, 25, 30, 27, 34, 33, 30, 36],
//           backgroundColor: '#36A2EB', // Sales color
//         },
//         {
//           label: 'Franchise Commission',
//           data: [50, 100, 70, 180, 250,80, 150, 100, 280, 350,400,150],
//           backgroundColor: '#FFCE56', // Commission color
//         },
//         {
//           label: 'Franchise Profit',
//           data: [50, 100, 70, 180, 250,400,500,80, 150, 100, 280, 350],
//           backgroundColor: '#4BC0C0', // Profit color
//         },
//       ],
//     },
//     territory: {
//       labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
//       datasets: [
//         {
//           label: 'Territory Sales',
//           data: [5, 6, 5, 12, 10, 12, 15, 13, 17, 16, 15, 18],
//           backgroundColor: '#FF6384', // Sales color
//         },
//         {
//           label: 'Territory Commission',
//           data: [80, 150, 100, 280, 350,200,100, 200, 300, 400, 500,200],
//           backgroundColor: '#FF9F40', // Commission color
//         },
//         {
//           label: 'Territory Profit',
//           data: [30, 80, 50, 100, 150,100, 200, 300, 400, 500,150,250],
//           backgroundColor: '#FFCD56', // Profit color
//         },
//       ],
//     },
//     agent: {
//       labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
//       datasets: [
//         {
//           label: 'Agent Sales',
//           data: [100, 200, 300, 400, 500,100, 200, 300, 400, 500,148,250],
//           backgroundColor: '#FFCE56', // Sales color
//         },
//         {
//           label: 'Agent Commission',
//           data: [5, 6, 5, 12, 10, 12, 15, 13, 17, 16, 15, 18],
//           backgroundColor: '#36A2EB', // Commission color
//         },
//         {
//           label: 'Agent Profit',
//           data: [20, 60, 40, 120, 160,100, 200, 300, 400, 500,400,250],
//           backgroundColor: '#FF6384', // Profit color
//         },
//       ],
//     },
//     customerVendor: {
//       labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
//       datasets: [
//         {
//           label: 'Customer Become Vendor Sales',
//           data: [250, 350, 150, 450, 650,100, 200, 300, 400, 500,300, 400,],
//           backgroundColor: '#4BC0C0', // Sales color
//         },
//         {
//           label: 'Customer Become Vendor Commission',
//           data: [80, 120, 90, 240, 300,100, 200, 300, 400, 205,120, 90],
//           backgroundColor: '#FF9F40', // Commission color
//         },
//         {
//           label: 'Customer Become Vendor Profit',
//           data: [30, 90, 60, 150, 200,100, 200, 300, 400, 500,150, 200],
//           backgroundColor: '#FFCD56', // Profit color
//         },
//       ],
//     },
//     vendor: {
//       labels: ['January', 'February', 'March', 'April', 'May','June','July','Augest','September','October','November','December'],
//       datasets: [
//         {
//           label: 'Vendor Sales',
//           data: [10, 11, 10, 25, 20, 25, 30, 27, 34, 33, 30, 36],
//           backgroundColor: '#9966FF', // Sales color
//         },
//         {
//           label: 'Vendor Commission',
//           data: [150, 300, 200, 350, 400,80, 200, 100, 250, 300,200, 100],
//           backgroundColor: '#FF6384', // Commission color
//         },
//         {
//           label: 'Vendor Profit',
//           data: [80, 200, 100, 250, 300,80, 200, 100, 250, 500,150, 300],
//           backgroundColor: '#4BC0C0', // Profit color
//         },
//       ],
//     },
//   };

//   const handleReportClick = (reportId) => {
//     setActiveReport(reportId); // Set the active report on click
//   };

//   const getFilteredData = () => {
//     const activeData = chartData[activeReport];
//     return {
//       labels: activeData.labels,
//       datasets: activeData.datasets.filter(dataset =>
//         dataset.label.toLowerCase().includes(viewType)  // Filter dataset based on viewType
//       ),
//     };
//   };

//   const getColorForView = (viewType) => {
//     switch(viewType) {
//         case 'Sales':
//             return 'blue';
//         case 'Commission':
//             return 'green';
//         case 'Profit':
//             return 'purple';
//         case 'Vendor':
//             return 'orange'; // New view
//         case 'Customer':
//             return 'red';    // New view
//         default:
//             return 'gray';   // Default color
//     }
// };

//   return (
//     <div className="dashboard-container">
//       {/* Dashboard Title */}
//       <h1 className="dashboard-heading">Dashboard</h1>

//       {/* Report Buttons */}
//       <div className="dashboard-cards">
//         {reports.map((report) => (
//           <div
//             key={report.id}
//             className="dashboard-card"
//             style={{ backgroundColor: report.color }}
//             onClick={() => handleReportClick(report.id)}
//           >
//             <h3>{report.title}</h3>
//             <p>Click to see chart</p>
//           </div>
//         ))}
//       </div>

//       {/* View Toggle Buttons */}
//       <div className="view-toggle-buttons">
//         <button onClick={() => setViewType('sales')}>Sales</button>
//         <button onClick={() => setViewType('commission')}>Commission</button>
//         <button onClick={() => setViewType('profit')}>Profit</button>
//       </div>

//       {/* Chart Section */}
//       {activeReport && (
//         <div className="dashboard-chart">
//           <h3>{reports.find((report) => report.id === activeReport).title} - Monthly {viewType.charAt(0).toUpperCase() + viewType.slice(1)}</h3>
//           <div className="chart-placeholder">
//             <Bar data={getFilteredData()} options={{ responsive: true }} />
//           </div>

//           {/* Table Section */}
//           <div className="dashboard-table-container">
//             <table className="dashboard-table">
//               <thead>
//                 <tr>
//                   <th>Month</th>
//                   <th>{viewType.charAt(0).toUpperCase() + viewType.slice(1)}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {chartData[activeReport].labels.map((month, index) => (
//                   <tr key={month}>
//                     <td>{month}</td>
//                     <td
//                       style={{
//                         color: getColorForView(viewType),
//                       }}
//                     >
//                       {chartData[activeReport].datasets.find(dataset => dataset.label.toLowerCase().includes(viewType)).data[index]}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//         /* Container and General Styling */
//         .dashboard-container {
//           padding: 10px;
//           background-color: #f4f6f9;
//           min-height: 100vh;
//           box-sizing: border-box;
//         }
//         .dashboard-heading {
//           font-size: 2rem;
//           color: #333;
//           margin-bottom: 20px;
//           font-weight: bold;
//         }

//         /* Top Cards Section */
//         .dashboard-cards {
//           display: flex;
//           justify-content: space-between;
//           gap: 20px;
//           margin-bottom: 20px;
//         }
//         .dashboard-card {
//           color: #fff;
//           padding: 20px;
//           border-radius: 19px;
//           flex: 1;
//           text-align: center;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           cursor: pointer;
//           transition: background-color 0.3s;
//         }
//         .dashboard-card:hover {
//           opacity: 0.8;
//         }

//         /* View Toggle Buttons */
//         .view-toggle-buttons {
//           margin-bottom: 20px;
//         }
//         .view-toggle-buttons button {
//           padding: 10px 20px;
//           margin-right: 10px;
//           background-color: #007bff;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .view-toggle-buttons button:hover {
//           opacity: 0.8;
//         }

//         /* Chart Section */
//         .dashboard-chart {
//           background-color: #fff;
//           padding: 20px;
//           border-radius: 8px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//           margin-bottom: 20px;
//         }
//         .chart-placeholder {
//           height: 250px;
//           background-color: #eaeaea;
//           border-radius: 4px;
//           text-align: center;
//           line-height: 250px;
//           color: #888;
//         }

//         /* Table Section */
//         .dashboard-table-container {
//           background-color: #fff;
//           padding: 20px;
//           border-radius: 8px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//         }
//         .dashboard-table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         .dashboard-table th,
//         .dashboard-table td {
//           border: 1px solid #ddd;
//           padding: 10px;
//           text-align: left;
//         }
//         .dashboard-table th {
//           background-color: #2c3e50;
//           color: #fff;
//         }
//         .dashboard-table td {
//           color: #333;
//         }
//         `}
//       </style>
//     </div>
//   );
// };

// export default Dashboard;
