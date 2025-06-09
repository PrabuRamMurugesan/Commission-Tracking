import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/CommissionReports.css"; // Import CSS

const CommissionReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchCommissionReports();
  }, []);

  const fetchCommissionReports = async () => {
    try {
      const response = await axios.get("/api/commission-reports");
      setReports(response.data);
      setFilteredReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commission reports:", error);
      setError("Failed to load commission report data.");
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = reports;
    if (role) {
      filtered = filtered.filter(report => report.role === role);
    }
    if (timeframe === "Monthly") {
      filtered = filtered.filter(report => report.periodType === "Monthly");
    } else if (timeframe === "Quarterly") {
      filtered = filtered.filter(report => report.periodType === "Quarterly");
    } else if (timeframe === "Yearly") {
      filtered = filtered.filter(report => report.periodType === "Yearly");
    }
    setFilteredReports(filtered);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Commission Reports", 20, 10);
    doc.autoTable({
      head: [["Date", "User", "Role", "Commission ($)"]],
      body: filteredReports.map(report => [report.date, report.name, report.role, report.commission]),
    });
    doc.save("commission-reports.pdf");
  };

  return (
    <div className="commission-reports-container">
      <h2 className="text-primary mb-4">📊 Commission Reports</h2>

      <div className="filters">
        <Form.Control as="select" onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="Franchise">Franchise</option>
          <option value="Territory Head">Territory Head</option>
          <option value="Agent">Agent</option>
          <option value="Vendor">Vendor</option>
          <option value="Referral">Referral</option>
        </Form.Control>

        <Form.Control as="select" onChange={(e) => setTimeframe(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </Form.Control>

        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>
      </div>

      <div className="export-buttons">
        <CSVLink data={filteredReports} filename="commission-reports.csv" className="btn btn-success">
          Export CSV
        </CSVLink>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading commission reports...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Role</th>
              <th>Commission ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{new Date(report.date).toLocaleDateString()}</td>
                <td>{report.name}</td>
                <td>{report.role}</td>
                <td>${report.commission}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <style>
        {`
        /* Commission Reports Styling */
.commission-reports-container {
  padding: 20px;
  max-width: 90%;
  margin: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select {
  width: 30%;
  padding: 10px;
  border-radius: 5px;
}

.export-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.table thead {
  background-color: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .filters select {
    width: 100%;
    margin-bottom: 10px;
  }
}
`}
      </style>
    </div>
  );
};

export default CommissionReports;


//upaded

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const CommissionReportsPage = () => {
//   const [role, setRole] = useState('');
//   const [status, setStatus] = useState('');
//   const [platform, setPlatform] = useState('');
//   const [reportData, setReportData] = useState([]);

//   const dummyReports = [
//     {
//       date: '2025-04-01',
//       role: 'Agent',
//       name: 'User1',
//       txnId: 'TXN1001',
//       platform: 'BBSCART',
//       type: 'Product Sale',
//       amount: 5000,
//       status: 'Paid',
//       method: 'Bank'
//     },
//     {
//       date: '2025-04-02',
//       role: 'CustomerBecomeAVendor',
//       name: 'User2',
//       txnId: 'TXN1002',
//       platform: 'Golldex',
//       type: 'Investment Referral',
//       amount: 8000,
//       status: 'Pending',
//       method: 'Wallet'
//     }
//   ];

//   const handleGenerateReport = (e) => {
//     e.preventDefault();
//     // Filter logic (placeholder)
//     setReportData(dummyReports);
//   };

//   return (
//     <div className="container-fluid py-4 commission-report-page bg-light">
//       <div className="container">
//         <h2 className="mb-4">Commission Reports</h2>

//         {/* Filter Section */}
//         <div className="card shadow mb-4">
//           <div className="card-body">
//             <form onSubmit={handleGenerateReport}>
//               <div className="row">
//                 <div className="col-md-3 mb-3">
//                   <label>User Role</label>
//                   <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
//                     <option value="">All</option>
//                     <option value="Admin">Admin</option>
//                     <option value="Franchise">Franchise</option>
//                     <option value="Territory Head">Territory Head</option>
//                     <option value="Agent">Agent</option>
//                     <option value="Vendor">Vendor</option>
//                     <option value="CustomerBecomeAVendor">CustomerBecomeAVendor</option>
//                   </select>
//                 </div>
//                 <div className="col-md-3 mb-3">
//                   <label>Status</label>
//                   <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
//                     <option value="">All</option>
//                     <option value="Paid">Paid</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </div>
//                 <div className="col-md-3 mb-3">
//                   <label>Platform</label>
//                   <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
//                     <option value="">All</option>
//                     <option value="BBSCART">BBSCART</option>
//                     <option value="Golldex">Golldex</option>
//                   </select>
//                 </div>
//                 <div className="col-md-3 d-flex align-items-end">
//                   <button type="submit" className="btn btn-primary w-100">Generate Report</button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Report Table */}
//         {reportData.length > 0 && (
//           <div className="card shadow">
//             <div className="card-header bg-primary text-white">
//               <h5>Report Results</h5>
//             </div>
//             <div className="card-body">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Role</th>
//                     <th>User</th>
//                     <th>Txn ID</th>
//                     <th>Platform</th>
//                     <th>Type</th>
//                     <th>Amount (₹)</th>
//                     <th>Status</th>
//                     <th>Method</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((report, idx) => (
//                     <tr key={idx}>
//                       <td>{report.date}</td>
//                       <td>{report.role}</td>
//                       <td>{report.name}</td>
//                       <td>{report.txnId}</td>
//                       <td>{report.platform}</td>
//                       <td>{report.type}</td>
//                       <td>₹{report.amount}</td>
//                       <td><span className={`badge bg-${report.status === 'Paid' ? 'success' : report.status === 'Pending' ? 'warning' : 'danger'}`}>{report.status}</span></td>
//                       <td>{report.method}</td>
//                       <td><button className="btn btn-sm btn-outline-primary">Download</button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .commission-report-page {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
//         .commission-report-page .card label {
//           font-weight: 600;
//         }
//         .commission-report-page .table th,
//         .commission-report-page .table td {
//           vertical-align: middle;
//         }
//         .commission-report-page .badge {
//           font-size: 0.75rem;
//           padding: 0.4em 0.7em;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CommissionReportsPage;