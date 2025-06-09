import React, { useEffect, useState } from "react";
import axios from "axios";
const user = {
  _id: "682ec627b6f27024eb810d98", // replace with your MongoDB user ID
  role: "Vendor", // or "CBAV", "Agent", etc.
};
const GSTFilingAssistant = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState("Vendor");
  const [periodFilter, setPeriodFilter] = useState("");
  const [returnFilter, setReturnFilter] = useState("");
  const [form, setForm] = useState({
    returnType: "",
    period: "",
    gstin: "",
    role: user.role,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [arn, setArn] = useState("");
  const [filedOn, setFiledOn] = useState("");
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [fileGenerated, setFileGenerated] = useState("");
  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 3000);
  };
  const fetchLogs = async () => {
    if (!selectedUserId) return;
    const res = await axios.get(
      `/api/gst-filing/logs?userId=${selectedUserId}`
    );
    setLogs(res.data.data);
  };
  
  const filteredLogs = logs.filter(
    (log) =>
      (periodFilter ? log.period === periodFilter : true) &&
      (returnFilter ? log.returnType === returnFilter : true)
  );
  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateReturn = async () => {
    if (!form.returnType || !form.period || !form.gstin || !form.role) {
      showToast("All fields are required", "danger");
      return;
    }

    const fileName = `GSTR_${form.returnType}_${form.period.replace(" ", "")}_${
      user._id
    }.json`;

    const payload = {
      userId: user._id,
      role: form.role,
      returnType: form.returnType,
      period: form.period,
      gstin: form.gstin,
      fileName,
      status: "Generated",
    };

    try {
      const res = await axios.post("/api/gst-filing/logs", payload);
      setFileGenerated(fileName);
      fetchLogs();
      showToast("✅ GST Return File Generated!");
    } catch (err) {
      console.error("❌ Axios POST failed:", err.response?.data || err.message);
      showToast("Something went wrong", "danger");
    }
  };
  
  console.log("🚀 Sending Payload:", {
    userId: user._id,
    role: form.role,
    returnType: form.returnType,
    period: form.period,
    gstin: form.gstin,
  });
  
  const markAsFiled = async () => {
    if (!arn || !filedOn) {
      alert("ARN and Filing Date are required.");
      return;
    }

    await axios.put(`/api/gst-filing/logs?id=${selectedLogId}`, {
      status: "Filed",
      arn,
      filedOn,
    });

    setArn("");
    setFiledOn("");
    setSelectedLogId(null);
    fetchLogs();
    showToast("✅ Filing record updated");
  };
  useEffect(() => {
    const fetchUsersByRole = async () => {
      if (!role) return;
      const res = await axios.get(`/api/users/by-role?role=${role}`);
      setUsers(res.data.data);
    };
    fetchUsersByRole();
  }, [role]);
  
  useEffect(() => {
    fetchLogs();
  }, []);
  const exportToCSV = () => {
    const csvContent = [
      ["Period", "Return Type", "Status", "Filed On", "ARN"],
      ...filteredLogs.map((log) => [
        log.period,
        log.returnType,
        log.status,
        log.filedOn ? new Date(log.filedOn).toLocaleDateString() : "",
        log.arn || "",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GST_Filing_Logs_${user.role}_${Date.now()}.csv`;
    link.click();
  };
  
  return (
    <div className="container mt-5">
      <h3 className="mb-4">
        <i className="bi bi-file-earmark-text-fill me-2"></i>GST Filing
        Assistant
      </h3>
      <button
        className="btn btn-outline-dark btn-sm mb-3"
        onClick={exportToCSV}
      >
        <i className="bi bi-file-earmark-excel me-1"></i> Export to Excel/CSV
      </button>

      {/* 📤 GST Generation Form */}
      <div className="card shadow-sm mb-4 p-4 border">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Return Type</label>
            <select
              name="returnType"
              className="form-select"
              onChange={handleInput}
              value={form.returnType}
              required
            >
              <option value="">Select</option>
              <option value="GSTR-1">GSTR-1 (Outward Sales)</option>
              <option value="GSTR-3B">GSTR-3B (Summary Return)</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Filing Period</label>
            <select
              name="period"
              className="form-select"
              onChange={handleInput}
              value={form.period}
              required
            >
              <option value="">Choose Period</option>
              <option>Jan 2025</option>
              <option>Feb 2025</option>
              <option>Mar 2025</option>
              <option>Apr 2025</option>
              <option>May 2025</option>
            </select>
          </div>
          <div className="col-md-3">
            <label>Role</label>
            <select
              className="form-control"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option>Vendor</option>
              <option>Agent</option>
              <option>CBAV</option>
              <option>Franchisee</option>
              <option>TerritoryHead</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">GSTIN</label>
            <input
              type="text"
              name="gstin"
              className="form-control"
              placeholder="27ABCDE1234F1Z5"
              value={form.gstin}
              onChange={handleInput}
              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
              required
            />
          </div>
          <div className="col-md-12">
            <button
              className="btn btn-primary mt-3 shadow-sm"
              onClick={generateReturn}
            >
              <i className="bi bi-arrow-down-circle me-2"></i>Generate GST File
            </button>
          </div>

          {fileGenerated && (
            <div className="alert alert-success mt-3">
              ✅ File Generated: <strong>{fileGenerated}</strong> &nbsp;
              <a
                href={`/downloads/${fileGenerated}`}
                className="btn btn-outline-success btn-sm ms-2"
                download
              >
                <i className="bi bi-download"></i> Download
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 📜 Filing History Table */}
      <h4 className="mb-3">📋 Filing History</h4>
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Filter by Period</label>
          <select
            className="form-select"
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="">All</option>
            <option>Jan 2025</option>
            <option>Feb 2025</option>
            <option>Mar 2025</option>
            <option>Apr 2025</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>Filter by Return Type</label>
          <select
            className="form-select"
            onChange={(e) => setReturnFilter(e.target.value)}
          >
            <option value="">All</option>
            <option>GSTR-1</option>
            <option>GSTR-3B</option>
          </select>
        </div>
      </div>

      <table className="table table-striped table-hover border">
        <thead className="table-dark">
          <tr>
            <th>Period</th>
            <th>Return Type</th>
            <th>Status</th>
            <th>Filed On</th>
            <th>ARN</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                📭 No filing records found
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id}>
                <td>{log.period}</td>
                <td>{log.returnType}</td>
                <td>{log.status}</td>
                <td>
                  {log.filedOn
                    ? new Date(log.filedOn).toLocaleDateString()
                    : "-"}
                </td>
                <td>{log.arn || "-"}</td>
                <td>
                  <a
                    href={`/downloads/${log.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Download
                  </a>
                  {log.status !== "Filed" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => setSelectedLogId(log._id)}
                    >
                      Mark as Filed
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Mark as Filed */}
      {selectedLogId && (
        <div className="card mt-4 p-3 border border-success shadow-sm">
          <h5 className="mb-3">✅ Mark GST Return as Filed</h5>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">ARN No</label>
              <input
                className="form-control"
                value={arn}
                onChange={(e) => setArn(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Filed On</label>
              <input
                type="date"
                className="form-control"
                value={filedOn}
                onChange={(e) => setFiledOn(e.target.value)}
              />
            </div>
            <div className="col-md-12 mt-3">
              <button className="btn btn-success" onClick={markAsFiled}>
                <i className="bi bi-check2-square me-1"></i>Update Filing Record
              </button>
            </div>
          </div>
        </div>
      )}
      {toast.show && (
        <div
          className={`toast show position-fixed bottom-0 end-0 m-3 bg-${toast.variant} text-white`}
          role="alert"
        >
          <div className="toast-body">{toast.message}</div>
        </div>
      )}
    </div>
  );
};

export default GSTFilingAssistant;
