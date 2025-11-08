// src/pages/HealthcareFilterBar.jsx
import React, { useState } from "react";

const HealthcareFilterBar = ({ healthcare = [], setFilteredHealthcare }) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Extract unique filter options safely
  const uniqueCities = [...new Set(healthcare.map((h) => h.city).filter(Boolean))];
  const uniqueTypes = [...new Set(healthcare.map((h) => h.type).filter(Boolean))];

  const handleFilter = () => {
    let filtered = [...healthcare];

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase()) ||
          item.contact?.includes(search)
      );
    }

    if (city) {
      filtered = filtered.filter((item) => item.city === city);
    }

    if (type) {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (status) {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredHealthcare(filtered);
  };

  return (
    <div className="border rounded-3 mb-4 bg-white shadow-sm p-4">
      <div className="d-flex flex-row align-items-center justify-content-between gap-3 flex-wrap">
        {/* Search bar */}
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control border-start-2"
            placeholder="Search name | email | contact"
            style={{ borderRadius: "10px", width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* City filter */}
        <div className="col-md-2 mb-2">
          <select
            className="form-select border-start-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Type filter (e.g., Hospital, Clinic, Pharmacy) */}
        <div className="col-md-2 mb-2">
          <select
            className="form-select border-start-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="col-md-2 mb-2">
          <select
            className="form-select border-start-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Filter button */}
      <div className="col-md-5 mb-2 d-flex flex-row align-items-center justify-content-center w-100 mt-3">
        <button
          className="btn btn-secondary w-100 border-start-0"
          onClick={handleFilter}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default HealthcareFilterBar;
