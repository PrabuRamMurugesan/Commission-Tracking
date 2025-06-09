
import React from "react";
import Sidebar from "../components/Sidebar";

const CommissionPayouts = () => {
  return (
    <div className="payout-page">
        <Sidebar />
      
      <div className="main-content">
        <h2 className="mb-4">Commission Payouts Dashboard</h2>

        {/* Payout Summary Cards */}
        <div className="summary-cards">
          {[{
            title: "Total Payouts This Month",
            value: "₹1,00,000",
            color: "primary"
          }, {
            title: "Pending Payouts",
            value: "₹20,000",
            color: "warning"
          }, {
            title: "Approved Payouts",
            value: "₹75,000",
            color: "success"
          }, 
          {
            title: "Rejected Payouts",
            value: "₹5,000",
            color: "danger"
          }, {
            title: "Wallet Credited ",
            value: "₹",
            color: "danger"
          },
          
        ].map((item, idx) => (
            <div className="card" key={idx}>
              <h6>{item.title}</h6>
              <h3 className={`text-${item.color}`}>{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Payout Table */}
      <div className="table-container mt-4 ">
        <h5>Payout Transactions</h5>
        <div className="filters d-flex justify-content-between mb-4 px-4 overflow-auto gap-3">
          <input type="date" placeholder="Start Date" />
          <input type="date" placeholder="End Date" />
          <select>
            <option value="">Select Role</option>
            <option value="Franchisee">Franchisee</option>
            <option value="Agent">Agent</option>
          </select>
          <select >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select>
            <option value="">Select Method</option>
            <option value="Bank">Bank</option>
            <option value="Wallet">Wallet</option>
            <option value="UPI">UPI</option>
          </select>
          <select>
            <option value="">Select Platform</option>
            <option value="BBSCART">BBSCART</option>
            <option value="Golldex">Golldex</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User Role</th>
              <th>Name</th>
              <th>Transaction/Commission ID</th>
              <th>Amount(₹)</th>
              <th>Payout Method</th>
              <th>Payout Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((id) => (
              <tr key={id}>
                <td>2025-04-01</td>
                <td>{id === 3 ? "CustomerBecomeAVendor" : "Agent"}</td>
                <td>User{id}</td>
                <td>TXN{id}12345</td>
                <td>₹{5000 * id}</td>
                <td>{id === 2 ? "Wallet" : id === 3 ? "UPI" : "Bank Transfer"}</td>
                <td>
                  <span className={`status ${id === 1 ? "pending" : id === 2 ? "processing" : "completed"}`}>
                    {id === 1 ? "Pending" : id === 2 ? "Processing" : "Completed"}
                  </span>
                </td>
                <div className="actions-commissionpayout">
                <td>
                  <button className="btn-view" style={{ backgroundColor: '#17a2b8', color: 'white' }}>View Slip</button>
                  <button className="btn-approve "style={{ backgroundColor: '#28a745', color: 'white' }}>Approve</button>
                  <button className="btn-reject"style={{ backgroundColor: '#dc3545', color: 'white' }}>Reject</button>
                </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <style>{`
        .payout-page {
          display: flex;
          height: 100vh;
          width: 100vw;
        }
        .main-content {
        width: 100%;
        height: 100%;
        padding: 7% 20px;
        overflow-y: scroll;
      }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .card {
          padding: 15px;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
        }
        .status {
          padding: 5px 10px;
          border-radius: 5px;
        }
       .actions-commissionpayout button {
        margin-right: 13px;
          margin: 5px;
        border-radius: 5px;
        cursor: pointer;
        border: none;
        color: white;
       }

       @media (max-width: 768px) {
   
       .main-content {
        padding: 7rem 10px;
       }
  
          
      `}</style>
    </div>
  );
};

export default CommissionPayouts;
