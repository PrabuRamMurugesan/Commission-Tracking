import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const AIAnomalyDetection = () => {
  return (
    <div className=" anomaly-page">
      
        <Sidebar/>
      
      <div className=" anomaly">
        <h2 className="mb-4">AI Anomaly Detection Dashboard</h2>

        {/* Quick Overview Cards */}
        <div className="row g-4 mb-4">
          {[{"title":"Total Anomalies","value":120,"color":"primary"},
            {"title":"Critical Issues","value":5,"color":"danger"},
            {"title":"Resolved","value":100,"color":"success"},
            {"title":"Unresolved","value":20,"color":"warning"}].map((item, idx) => (
            <div className="col-md-3" key={idx}>
              <div className={`card border-${item.color} shadow`}>
                <div className="card-body">
                  <h5>{item.title}</h5>
                  <h3 className={`text-${item.color}`}>{item.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Anomaly Logs */}
        <div className="card shadow mb-4">
          <div className="card-header bg-danger text-white">
            <h5>Detected Anomalies</h5>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Anomaly Type</th>
                  <th>Affected User</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((idx) => (
                  <tr key={idx}>
                    <td>2025-04-01 12:30 PM</td>
                    <td>Fraud Transaction</td>
                    <td>User123</td>
                    <td><span className="badge bg-danger">Critical</span></td>
                    <td><span className="badge bg-warning">Investigating</span></td>
                    <td className='ad-buttons'>
                      <button className="btn btn-sm btn-primary me-1">Details</button>
                      <button className="btn btn-sm btn-success me-1">Resolve</button>
                      <button className="btn btn-sm btn-secondary">Assign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Notifications Panel */}
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h5>Real-Time Notifications</h5>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {["Critical anomaly detected on transaction #54321",
                "Suspicious login attempt detected",
                "Unusual sales spike identified in Franchise XYZ"].map((note, idx) => (
                <li className="list-group-item" key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .anomaly-page {
          display: flex;
          height: 100vh;
          width: 100vw;
           }
          .anomaly{
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          padding: 7% 20px;
          }
          .anomaly::-webkit-scrollbar {
            width: 10px;
          }
          .anomaly::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .anomaly::-webkit-scrollbar-thumb {
            background: #888;
          }
          .anomaly::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        @media (max-width: 768px) {
          .anomaly{
            padding: 8rem 20px;
          
        }
            .card-body {
              overflow-x: scroll;
            }
            .ad-buttons {
              display: flex;
              justify-content: center;
              flex-direction: column;
            }
            .ad-buttons button {
              margin-bottom: 5px;
              width: 100%;
            }
        }
      `}</style>
    </div>
  );
};

export default AIAnomalyDetection;
