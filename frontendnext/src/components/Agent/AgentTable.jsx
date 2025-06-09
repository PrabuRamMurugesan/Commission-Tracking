// src/components/AgentTable.jsx
import React from "react";

const AgentTable = ({ agents, loading, refreshList, setToast }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>BPC</th>
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
                Loading agents...
              </td>
            </tr>
          ) : agents.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center">
                No agents found
              </td>
            </tr>
          ) : (
            agents.map((agent, index) => (
              <tr key={agent._id}>
                <td>{index + 1}</td>
                <td>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.businessPartnerCode}</td>
                <td>{agent.phone}</td>
                <td>{agent.platform}</td>
                <td>{agent.zone || "-"}</td>
                <td>
                  <span
                    className={`badge bg-${
                      agent.accountStatus === "active" ? "success" : "secondary"
                    }`}
                  >
                    {agent.accountStatus}
                  </span>
                </td>
                <td>{agent.totalCustomers || 0}</td>
                <td>{agent.totalTransactions || 0}</td>
                <td>₹{agent.commissionEarned || 0}</td>
                <td>₹{agent.commissionPending || 0}</td>
                <td>
                  {new Date(
                    agent.joinedDate || agent.createdAt
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

export default AgentTable;
