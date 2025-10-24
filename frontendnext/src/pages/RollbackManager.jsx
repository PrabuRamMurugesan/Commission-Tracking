import React, { useEffect, useState } from "react";
import axios from "axios";

const RollbackManager = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rollbackMessage, setRollbackMessage] = useState("");
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/vendor-products/logs");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setError("Failed to load upload logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (logId) => {
    try {
      setRollbackMessage("Rolling back...");
      const res = await axios.post("/api/vendor-products/rollback", { logId });

      if (res.data.success) {
        setRollbackMessage("Rollback successful ✅");
        fetchLogs(); // Refresh logs
      } else {
        setRollbackMessage("Rollback failed ❌");
      }
    } catch (err) {
      console.error("Rollback error:", err);
      setRollbackMessage("Rollback failed ❌");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">⏪ Rollback Manager</h3>

      {loading && <p>Loading logs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {rollbackMessage && (
        <div className="alert alert-info">{rollbackMessage}</div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Valid Rows</th>
              <th>Uploaded At</th>
              <th>Rollback</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log._id}>
                <td>{index + 1}</td>
                <td>{log.fileName}</td>
                <td>{log.validCount}</td>
                <td>{new Date(log.uploadedAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRollback(log._id)}
                    disabled={log.validCount === 0}
                  >
                    🔁 Rollback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RollbackManager;
