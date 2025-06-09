import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CbvCustomerList = () => {
  const [cbvs, setCbvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCbvs = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        console.log("🧾 Cbv API Response:", res.data.cbv); // ✅ ADD THIS

        setCbvs(res.data.cbv|| []);
      } catch (err) {
        console.error("Error loading cbvs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCbvs();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-4 text-primary">Choose Cbv for Customers List</h2>

      <div className="table-responsive border rounded shadow-sm">
        <table className="table table-bordered table-hover table-sm mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Zone</th>
              <th>Total Customers</th>
              <th>Total Transactions</th>
              <th>Commission Earned</th>
              <th>Commission Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cbvs.map((cbv, index) => (
              <tr key={cbv._id}>
                <td>{index + 1}</td>
                <td>{cbv.name}</td>
                <td>{cbv.email}</td>
                <td>{cbv.phone || "-"}</td>
                <td>{cbv.zone || "-"}</td>
                <td>{cbv.totalCustomers || 0}</td>
                <td>{cbv.totalTransactions || 0}</td>
                <td>₹ {cbv.commissionEarned?.toLocaleString() || 0}</td>
                <td>₹ {cbv.commissionPending?.toLocaleString() || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/customer-list?role=cbv&userId=${cbv._id}`
                      )
                    }
                  >
                    View Customers
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

export default CbvCustomerList;
