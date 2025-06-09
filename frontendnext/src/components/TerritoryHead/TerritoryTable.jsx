// src/components/TerritoryTable.jsx
import React from "react";

const TerritoryTable = ({ territory, loading, refreshList, setToast }) => {
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
                Loading territory...
              </td>
            </tr>
          ) : territory.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center">
                No territory found
              </td>
            </tr>
          ) : (
            territory.map((territory, index) => (
              <tr key={territory._id}>
                <td>{index + 1}</td>
                <td>{territory.name}</td>
                <td>{territory.email}</td>
                <td>{territory.businessPartnerCode}</td>
                <td>{territory.phone}</td>
                <td>{territory.platform}</td>
                <td>{territory.zone || "-"}</td>
                <td>
                  <span
                    className={`badge bg-${
                      territory.accountStatus === "active"
                        ? "success"
                        : "secondary"
                    }`}
                  >
                    {territory.accountStatus}
                  </span>
                </td>
                <td>{territory.totalCustomers || 0}</td>
                <td>{territory.totalTransactions || 0}</td>
                <td>₹{territory.commissionEarned || 0}</td>
                <td>₹{territory.commissionPending || 0}</td>
                <td>
                  {new Date(
                    territory.joinedDate || territory.createdAt
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

export default TerritoryTable;
