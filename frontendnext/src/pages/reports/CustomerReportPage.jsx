import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerReportPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/api/reports/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Customer Report</h2>

      {/* Filters - Optional Implementation Later */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="date"
            className="form-control"
            placeholder="Start Date"
          />
        </div>
        <div className="col">
          <input type="date" className="form-control" placeholder="End Date" />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search Name / Email / Phone"
          />
        </div>
        <div className="col">
          <button className="btn btn-primary w-100">Apply Filters</button>
        </div>
        <div className="col">
          <button className="btn btn-success w-100">Export to Excel</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm">
          <thead className="thead-light">
            <tr>
              <th>Date / Time</th>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Platform</th>
              <th>Role</th>
              <th>Referred By</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Wallet</th>
              <th>Orders</th>
              <th>KYC</th>
              <th>Last Active</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="16" className="text-center">
                  No customer records found.
                </td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <tr key={i}>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>{c.customerId}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.platform}</td>
                  <td>{c.role}</td>
                  <td>{c.referredBy || "-"}</td>
                  <td>{c.zone || "-"}</td>
                  <td>{c.accountStatus}</td>
                  <td>₹{c.walletBalance?.toFixed(2)}</td>
                  <td>{c.totalOrders || 0}</td>
                  <td>{c.kycStatus}</td>
                  <td>
                    {c.lastActive
                      ? new Date(c.lastActive).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{c.comments || "-"}</td>
                  <td>
                    <button className="btn btn-info btn-sm">Expand</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerReportPage;
