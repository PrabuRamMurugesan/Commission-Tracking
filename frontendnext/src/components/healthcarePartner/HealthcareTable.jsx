// src/components/Healthcare/HealthcareTable.jsx

import React from "react";
import { FaEdit, FaTrashAlt, FaUserNurse } from "react-icons/fa";
import axios from "axios";

const HealthcareTable = ({ partners, loading, refreshList, setToast }) => {
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this Healthcare Partner?"
      )
    )
      return;

    try {
      const res = await axios.delete(`/api/healthcare/${id}`);

      if (res.data.success) {
        setToast({
          show: true,
          type: "success",
          message: "Partner deleted successfully!",
        });
        refreshList();
      } else {
        setToast({
          show: true,
          type: "error",
          message: res.data.error || "Failed to delete",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        type: "error",
        message: "Something went wrong",
      });
    }
  };

  return (
    <div className="table-responsive border rounded shadow-sm">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Partner Code</th>
            <th>Name</th>
            <th>Clinic</th>
            <th>Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                <div className="spinner-border text-dark"></div>
              </td>
            </tr>
          ) : partners.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                <p className="text-muted">No Healthcare Partners Found</p>
              </td>
            </tr>
          ) : (
            partners.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td className="fw-semibold">{p.partnerCode || "—"}</td>
                <td>{p.fullName || p.name || "—"}</td>
                <td>{p.clinicName || "—"}</td>
                <td>{p.phone || "—"}</td>
                <td>{p.email || "—"}</td>
                <td>{p.city || "—"}</td>

                <td>
                  <span
                    className={`badge px-3 py-2 ${
                      p.status === "approved"
                        ? "bg-success"
                        : p.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {p.status || "pending"}
                  </span>
                </td>

                <td className="text-center">
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-sm btn-outline-dark d-flex align-items-center"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center"
                      onClick={() => handleDelete(p._id)}
                      title="Delete"
                    >
                      <FaTrashAlt size={14} />
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

export default HealthcareTable;
