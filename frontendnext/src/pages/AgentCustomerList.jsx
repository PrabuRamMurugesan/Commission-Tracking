import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AgentCustomerList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("/api/users/by-role");
        setAgents(res.data.agents || []);
      } catch (err) {
        console.error("Error loading agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h3 mb-4 text-primary">Choose Agent for Customers List</h2>

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
            {agents.map((agent, index) => (
              <tr key={agent._id}>
                <td>{index + 1}</td>
                <td>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.phone || "-"}</td>
                <td>{agent.zone || "-"}</td>
                <td>{agent.totalCustomers || 0}</td>
                <td>{agent.totalTransactions || 0}</td>
                <td>₹ {agent.commissionEarned?.toLocaleString() || 0}</td>
                <td>₹ {agent.commissionPending?.toLocaleString() || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/customer-list?role=agent&userId=${agent._id}`
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

export default AgentCustomerList;
