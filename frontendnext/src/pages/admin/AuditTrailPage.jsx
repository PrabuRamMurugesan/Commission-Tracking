import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const AuditTrailPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/audit-trail")
      .then((res) => {
        if (res.data?.success) {
          setLogs(res.data.logs);
        }
      })
      .catch((err) => {
        console.error("Audit fetch failed:", err);
      });
  }, []);

  return (
    <div className="d-flex flex-row vw-100 vh-100">
      <Sidebar />
      <div className="d-flex align-item-center justify-content-center vw-100 vh-100 my-5 p-5">
        <div className="container mt-4">
          <h3>Audit Trail</h3>
          {logs.length === 0 ? (
            <p>No audit logs found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Old</th>
                  <th>New</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.user || "N/A"}</td>
                    <td>{log.action || "N/A"}</td>
                    <td>{log.description || "N/A"}</td>
                    <td>{log.previousValue || "-"}</td>
                    <td>{log.newValue || "-"}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPage;
