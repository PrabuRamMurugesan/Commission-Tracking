import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorCustomerList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        console.log("🧾 Vendor API Response:", res.data.vendors); // ✅ ADD THIS

        setVendors(res.data.vendors || []);
      } catch (err) {
        console.error("Error loading vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-4 text-primary">Choose Vendor for Customers List</h2>

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
            {vendors.map((vendor, index) => (
              <tr key={vendor._id}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone || "-"}</td>
                <td>{vendor.zone || "-"}</td>
                <td>{vendor.totalCustomers || 0}</td>
                <td>{vendor.totalTransactions || 0}</td>
                <td>₹ {vendor.commissionEarned?.toLocaleString() || 0}</td>
                <td>₹ {vendor.commissionPending?.toLocaleString() || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/customer-list?role=vendor&userId=${vendor._id}`
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

export default VendorCustomerList;
