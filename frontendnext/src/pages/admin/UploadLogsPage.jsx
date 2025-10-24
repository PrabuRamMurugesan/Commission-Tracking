import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/upload-logs").then((res) => setLogs(res.data.logs));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Upload Logs</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Uploaded By</th>
            <th>Valid</th>
            <th>Flagged</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.fileName}</td>
              <td>{log.uploadedBy || "N/A"}</td>
              <td>{log.validCount}</td>
              <td>{log.flaggedCount}</td>
              <td>{log.totalRows}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadLogsPage;
