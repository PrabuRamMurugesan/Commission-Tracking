import React, { useEffect, useState } from "react";
import axios from "axios";

import AddBeneficiaryWizard from "./AddBeneficiaryWizard";
import BeneficiaryTable from "./BeneficiaryTable";
import BeneficiaryFilterBar from "./BeneficiaryFilterBar";
import Sidebar from "../Sidebar";

const MyBeneficiaries = () => {
  const [openWizard, setOpenWizard] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    state: "",
    planType: "",
    status: "",
  });

  const loadData = async () => {
    try {
      const res = await axios.get("/api/beneficiaries", {
        params: {
          createdBy: localStorage.getItem("userId"),
          city: filters.city || undefined,
          state: filters.state || undefined,
          planType: filters.planType || undefined,
          status: filters.status || undefined,
        },
      });

      let data = res.data.data;

      if (filters.search) {
        data = data.filter(
          (b) =>
            b.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            b.phone?.includes(filters.search)
        );
      }

      setBeneficiaries(data);
    } catch (err) {
      console.error(err);
      alert("Error loading beneficiaries");
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this beneficiary?")) return;

    try {
      await axios.delete(`/api/beneficiaries/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error deleting beneficiary");
    }
  };

  const updateFilter = (name, val) => {
    setFilters({ ...filters, [name]: val });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      city: "",
      state: "",
      planType: "",
      status: "",
    });
  };

  return (
    <>
     <div className="d-flex vw-100">
         <Sidebar />
        <div className="container-fluid p-5 border rounded bg-light shadow m-5">
      <div className="d-flex justify-content-between align-items-center  m-2 p-5">
        <h3>My Beneficiaries</h3>

        <button className="btn btn-primary" onClick={() => setOpenWizard(true)}>
          + Add Beneficiary
        </button>
      </div>

      <BeneficiaryFilterBar
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      <BeneficiaryTable
        data={beneficiaries}
        onEdit={(b) => alert("Edit coming soon")}
        onDelete={handleDelete}
      />

      {openWizard && (
        <AddBeneficiaryWizard
          onClose={() => setOpenWizard(false)}
          onSuccess={loadData}
        />
      )}
    </div>
     </div>
    </>

  );
};

export default MyBeneficiaries;
