import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const CommissionTrendsPage = () => {
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Commission (₹)',
        data: [10000, 15000, 12000, 18000, 20000, 17000],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      }
    ]
  };

  const barData = {
    labels: ['Franchise', 'Agent', 'Vendor', 'CustomerBecomeAVendor'],
    datasets: [
      {
        label: 'Commission Earned (₹)',
        data: [20000, 15000, 10000, 8000],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6f42c1']
      }
    ]
  };

  const pieData = {
    labels: ['BBSCART', 'Golldex'],
    datasets: [
      {
        label: 'Platform Distribution',
        data: [60, 40],
        backgroundColor: ['#17a2b8', '#fd7e14'],
      }
    ]
  };

  return (
    <div className="commission-trends-page">
    
          <Sidebar/>

        

        {/* Main Content */}
        <div className="content-container">
          <h2 className="mb-4">Commission Trends Dashboard</h2>

          {/* Dashboard Widgets */}
          <div className="dashboard-widgets">
            <div className="widget card">
              <h5>Total Commission</h5>
              <p>Current Month: ₹50,000</p>
              <p>Last Month: ₹45,000</p>
              <p>This Year: ₹3,00,000</p>
            </div>

            <div className="widget card">
              <h5>Top Earning Role</h5>
              <p>Franchise (₹20,000)</p>
            </div>

            <div className="widget card">
              <h5>Platform Performance</h5>
              <p>BBSCART: 60% | Golldex: 40%</p>
            </div>

            <div className="widget card">
              <h5>Commission Growth %</h5>
              <p>MoM: +12%</p>
              <p>QoQ: +18%</p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section card shadow p-3 mb-4 w-100">
            <h5>Filter Data</h5>
            <div className="filters">
              <select className="form-select">
                <option>Select Date Range</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
              <select className="form-select">
                <option>Select Role</option>
                <option>Franchise</option>
                <option>Agent</option>
                <option>Vendor</option>
              </select>
              <select className="form-select">
                <option>Select Platform</option>
                <option>BBSCART</option>
                <option>Golldex</option>
              </select>
              <select className="form-select">
                <option>Select Commission Type</option>
                <option>Base</option>
                <option>Bonus</option>
              </select>
            </div>
          </div>

          {/* Charts Section */}
          <div className="chart-container">
            {/* Line Chart */}
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5>Monthly Commission Trend</h5>
              </div>
              <div className="card-body">
                <Line data={lineData} />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h5>Commission by Role</h5>
              </div>
              <div className="card-body">
                <Bar data={barData} />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                <h5>Platform Distribution</h5>
              </div>
              <div className="card-body">
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
      

      <style>{`
        .commission-trends-page {
        display: flex;  
        width: 100vw;
        
          height: 100vh;
        }
        

        .content-container {
          flex-grow: 1;
          padding: 6%;
          display: flex;
          flex-direction: column;
          width: 100%
          height: 100%;
          overflow-y: scroll;

        }

        /* Dashboard Widgets */
        .dashboard-widgets {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }

        .widget {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          text-align: center;
        }

        /* Filters Section */
        .filters-section {
          width: 79%;
          text-align: center;
          align-items: center;
          

        }
      

        .filters {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .filters select {
          flex: 1;
          min-width: 150px;
        }

        /* Charts Layout */
        .chart-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .chart-container .card {
          flex: 1;
          min-width: 300px;
          max-width: 400px;
        }

       @media (max-width: 768px) {
         .content-container {
           padding: 7rem 10px;
         }
           .dashboard-widgets {
           justify-content: center;
         }
       }
      `}</style>
    </div>
  );
};

export default CommissionTrendsPage;

