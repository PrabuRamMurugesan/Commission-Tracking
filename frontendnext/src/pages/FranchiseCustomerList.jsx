import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FranchiseCustomerList = () => {
  const [franchise, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        console.log("🧾 Franchise API Response:", res.data.franchise); // ✅ ADD THIS

        setFranchises(res.data.franchise || []);
      } catch (err) {
        console.error("Error loading franchise:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchises();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-4 text-primary">Choose Franchise for Customers List</h2>

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
            {franchise.map((franchise, index) => (
              <tr key={franchise._id}>
                <td>{index + 1}</td>
                <td>{franchise.name}</td>
                <td>{franchise.email}</td>
                <td>{franchise.phone || "-"}</td>
                <td>{franchise.zone || "-"}</td>
                <td>{franchise.totalCustomers || 0}</td>
                <td>{franchise.totalTransactions || 0}</td>
                <td>₹ {franchise.commissionEarned?.toLocaleString() || 0}</td>
                <td>₹ {franchise.commissionPending?.toLocaleString() || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/customer-list?role=franchise&userId=${franchise._id}`
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

export default FranchiseCustomerList;
