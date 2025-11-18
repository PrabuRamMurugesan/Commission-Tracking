import React from "react";

const BeneficiaryTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Plan Type</th>
            <th>Status</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-3">
                No Beneficiaries Found
              </td>
            </tr>
          )}

          {data.map((b) => (
            <tr key={b._id}>
              <td>{b.fullName}</td>
              <td>{b.phone}</td>
              <td>{b.city}</td>
              <td>{b.planType || "-"}</td>
              <td>
                <span
                  className={
                    b.status === "active"
                      ? "badge bg-success"
                      : b.status === "pending"
                      ? "badge bg-warning text-dark"
                      : "badge bg-secondary"
                  }
                >
                  {b.status}
                </span>
              </td>

              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => onEdit(b)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(b._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeneficiaryTable;
