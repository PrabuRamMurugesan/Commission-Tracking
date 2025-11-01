import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/upload-logs").then((res) => setLogs(res.data.logs));
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-start vh-100 vw-100 my-5 p-4">
      <div className="container mt-4 h-100 w-100 ">
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
    </div>
  );
};

export default UploadLogsPage;
