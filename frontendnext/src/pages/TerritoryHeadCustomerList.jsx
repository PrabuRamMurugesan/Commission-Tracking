import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TerritoryHeadCustomerList = () => {
  const [territory, setTerritorys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTerritorys = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        console.log("🧾 Territory API Response:", res.data.territory); // ✅ ADD THIS

        setTerritorys(res.data.territory || []);
      } catch (err) {
        console.error("Error loading territory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerritorys();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-4 text-primary">Choose Territory for Customers List</h2>

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
            {territory.map((territory, index) => (
              <tr key={territory._id}>
                <td>{index + 1}</td>
                <td>{territory.name}</td>
                <td>{territory.email}</td>
                <td>{territory.phone || "-"}</td>
                <td>{territory.zone || "-"}</td>
                <td>{territory.totalCustomers || 0}</td>
                <td>{territory.totalTransactions || 0}</td>
                <td>₹ {territory.commissionEarned?.toLocaleString() || 0}</td>
                <td>₹ {territory.commissionPending?.toLocaleString() || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/customer-list?role=territory&userId=${territory._id}`
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

export default TerritoryHeadCustomerList;
