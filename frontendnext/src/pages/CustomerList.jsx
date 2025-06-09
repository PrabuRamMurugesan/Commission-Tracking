// src/pages/CustomerList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerTable from "../components/Customer/CustomerTable";
import CustomerFilterBar from "../components/Customer/CustomerFilterBar";
import AddCustomerModal from "../components/Customer/AddCustomerModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import { useLocation } from "react-router-dom";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const query = useQuery();
  const agentId = query.get("agentId");
  const vendorId = query.get("vendorId");
  const cbvId = query.get("cbvId");
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const API = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("authToken");

      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get("role");
      const userId = urlParams.get("userId");

      console.log("🔍 Role:", role);
      console.log("🔍 User ID:", userId);

      const res = await axios.get(`${API}/api/customers/filtered`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role,
          userId,
        },
      });

      console.log("✅ Filtered Customers:", res.data.customers);

      setCustomers(res.data.customers);
      setFilteredCustomers(res.data.customers);
    } catch (err) {
      console.error("❌ Error loading customers:", err);
      setToast({
        show: true,
        message: "Failed to load customers",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddSuccess = () => {
    fetchCustomers();
    setToast({
      show: true,
      message: "Customer saved successfully!",
      type: "success",
    });
    setShowModal(false);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customer List</h3>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Customer
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={fetchCustomers}
          >
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline-success"
            onClick={() => exportAgentsToCSV(filteredCustomers)}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <CustomerFilterBar
        customers={customers}
        setFilteredCustomers={setFilteredCustomers}
      />

      <CustomerTable
        customers={filteredCustomers}
        loading={loading}
        refreshList={fetchCustomers}
        setToast={setToast}
      />

      <AddCustomerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddSuccess}
      />

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default CustomerList;
