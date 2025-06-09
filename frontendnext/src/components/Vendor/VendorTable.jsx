// src/components/VendorTable.jsx
import React from "react";

const VendorTable = ({ vendor, loading, refreshList, setToast }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <td>BPC</td>
            <th>Phone</th>
            <th>Platform</th>
            <th>Zone</th>
            <th>Status</th>
            <th>Customers</th>
            <th>Transactions</th>
            <th>Earned</th>
            <th>Pending</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="13" className="text-center">
                Loading vendor...
              </td>
            </tr>
          ) : vendor.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center">
                No vendor found
              </td>
            </tr>
          ) : (
            vendor.map((vendor, index) => (
              <tr key={vendor._id}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.businessPartnerCode}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.platform}</td>
                <td>{vendor.zone || "-"}</td>
                <td>
                  <span
                    className={`badge bg-${
                      vendor.accountStatus === "active"
                        ? "success"
                        : "secondary"
                    }`}
                  >
                    {vendor.accountStatus}
                  </span>
                </td>
                <td>{vendor.totalCustomers || 0}</td>
                <td>{vendor.totalTransactions || 0}</td>
                <td>₹{vendor.commissionEarned || 0}</td>
                <td>₹{vendor.commissionPending || 0}</td>
                <td>
                  {new Date(
                    vendor.joinedDate || vendor.createdAt
                  ).toLocaleDateString()}
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary">👁 View</button>
                    <button className="btn btn-outline-warning">
                      ⬆ Promote
                    </button>
                    <button className="btn btn-outline-danger">
                      🛑 Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;
