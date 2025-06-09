// src/components/CbvTable.jsx
import React from "react";

const CbvTable = ({ cbv, loading, refreshList, setToast }) => {
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
                Loading cbv...
              </td>
            </tr>
          ) : cbv.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center">
                No cbv found
              </td>
            </tr>
          ) : (
            cbv.map((cbv, index) => (
              <tr key={cbv._id}>
                <td>{index + 1}</td>
                <td>{cbv.name}</td>
                <td>{cbv.email}</td>
                <td>{cbv.businessPartnerCode}</td>
                <td>{cbv.phone}</td>
                <td>{cbv.platform}</td>
                <td>{cbv.zone || "-"}</td>
                <td>
                  <span
                    className={`badge bg-${
                      cbv.accountStatus === "active"
                        ? "success"
                        : "secondary"
                    }`}
                  >
                    {cbv.accountStatus}
                  </span>
                </td>
                <td>{cbv.totalCustomers || 0}</td>
                <td>{cbv.totalTransactions || 0}</td>
                <td>₹{cbv.commissionEarned || 0}</td>
                <td>₹{cbv.commissionPending || 0}</td>
                <td>
                  {new Date(
                    cbv.joinedDate || cbv.createdAt
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

export default CbvTable;
