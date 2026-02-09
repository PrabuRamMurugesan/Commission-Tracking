// src/pages/CustomerList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerTable from "../components/Customer/CustomerTable";
import CustomerFilterBar from "../components/Customer/CustomerFilterBar";
import AddCustomerModal from "../components/Customer/AddCustomerModal";
import ToastMessage from "../components/ToastMessage";
import { exportAgentsToCSV } from "../utils/exportHelpers";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
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
      const token = localStorage.getItem("authToken");

      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get("role");
      const userId = urlParams.get("userId");

      console.log("🔍 Role:", role);
      console.log("🔍 User ID:", userId);

      const res = await axios.get(`/api/customers/filtered`, {
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
  }, [query.get("role"), query.get("userId")]);

  const handleAddSuccess = () => {
    fetchCustomers();
    setToast({
      show: true,
      message: "Customer saved successfully!",
      type: "success",
    });
    setShowModal(false);
  };

  const filterRole = query.get("role");
  const filterUserId = query.get("userId");
  const isFilteredByPartner = filterRole && filterUserId;

  return (
   <div className="d-flex flex-row min-vh-100 vw-100"> 
   <Sidebar />
   <div className="container-fluid mt-4 d-flex flex-column gap-4 customer-list-page border rounded p-4 m-5 bg-light shadow w-100">
      <div className="customer-header d-flex justify-content-between align-items-center m-5">
        <div>
          <h3>Customer List</h3>
          {isFilteredByPartner && (
            <p className="text-muted small mb-0">
              Filtered by business partner: <span className="text-capitalize fw-medium">{filterRole}</span> (ID: {filterUserId})
            </p>
          )}
        </div>
        <div className="header-actions">
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
    <style>{`
    
  .customer-header {
  padding: 12px 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Buttons group */
.header-actions {
  display: flex;
  gap: 8px;
}

/* Tablet */
@media (max-width: 992px) {
  .customer-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions button {
    flex: 1;
    min-width: 150px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .customer-header h3 {
    font-size: 18px;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .header-actions button {
    width: 100%;
  }
}
    `}</style>
    </div>
  );
};

export default CustomerList;
