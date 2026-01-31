import React from "react";

const CustomerTable = ({ customers, loading, refreshList, setToast }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Referral ID</th>
            <th>Platform</th>
            <th>Zone</th>
            <th>Status</th>
            <th>Customers</th>
            <th>Transactions</th>
            {/* <th>Earned</th>
            <th>Pending</th> */}
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="14" className="text-center">
                Loading customers...
              </td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan="14" className="text-center">
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((c, idx) => (
              <tr key={c._id}>
                {/* 1 */}
                <td>{idx + 1}</td>
                {/* 2 */}
                <td>{c.name || "-"}</td>
                {/* 3 */}
                <td>{c.email || "-"}</td>
                {/* 4 */}
                <td>{c.phone || c.mobile || "-"}</td>
                {/* 5 – Role (BBSlive: role; CRM: referralType) */}
                <td className="text-capitalize">{c.role || c.referralType || "-"}</td>
                <td className="text-capitalize">
                  {c.referralId || (c.vendor_id ? String(c.vendor_id) : "-")}
                </td>
                {/* 6 – Platform */}
                <td>{c.platform || "-"}</td>
                {/* 7 – Zone */}
                <td>{c.zone || "-"}</td>
                {/* 8 – Status */}
                <td>
                  <span
                    className={`badge bg-${
                      c.accountStatus === "active" ? "success" : "secondary"
                    }`}
                  >
                    {c.accountStatus || "unknown"}
                  </span>
                </td>
                {/* 9 – Customers count */}
                <td>{c.totalCustomers ?? c.customers?.length ?? 0}</td>
                {/* 10 – Transactions count */}
                <td>{c.totalTransactions ?? c.transactions?.length ?? 0}</td>
                {/* 11 – Earned commission */}
                {/* <td>₹ {c.commissionEarned ?? 0}</td> */}
                {/* 12 – Pending commission */}
                {/* <td>₹ {c.commissionPending ?? 0}</td> */}
                {/* 13 – Joined date */}
                <td>
                  {new Date(
                    c.joinedDate || c.createdAt || ""
                  ).toLocaleDateString() || "-"}
                </td>
                {/* 14 – Actions */}
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

export default CustomerTable;
