// src/components/Healthcare/HealthcareFilterBar.jsx

import React, { useState, useEffect } from "react";

const HealthcareFilterBar = ({ partners, setFilteredPartners }) => {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [clinicType, setClinicType] = useState("");
  const [platform, setPlatform] = useState("");
  const [service, setService] = useState("");

 const platformOptions = [...new Set(partners.map(p => p.platform).filter(Boolean))];
  const serviceOptions = [...new Set(
      partners.flatMap(p => p.supportedServices || []).filter(Boolean)
  )];
  // Auto generate dropdown options based on existing data
  const districtOptions = [
    ...new Set(partners.map((p) => p.district).filter(Boolean)),
  ];
  const stateOptions = [
    ...new Set(partners.map((p) => p.state).filter(Boolean)),
  ];
  const clinicTypeOptions = [
    ...new Set(partners.map((p) => p.clinicType).filter(Boolean)),
  ];

  const applyFilters = () => {
    let filtered = partners;

    if (search.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          (p.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.phone || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (district) {
      filtered = filtered.filter((p) => p.district === district);
    }

    if (state) {
      filtered = filtered.filter((p) => p.state === state);
    }

    if (clinicType) {
      filtered = filtered.filter((p) => p.clinicType === clinicType);
    }
    if (platform) filtered = filtered.filter((p) => p.platform === platform);

   if (service)
     filtered = filtered.filter((p) => (p.supportedServices || []).includes(service));
    setFilteredPartners(filtered);
  };

  const resetFilters = () => {
    setSearch("");
    setDistrict("");
    setState("");
    setClinicType("");
    setFilteredPartners(partners);
  };

  return (
    <div className="border rounded p-3 mb-3 shadow-sm bg-light">
      <div className="row g-3 align-items-end">
        {/* Search */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* District */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">District</label>
          <select
            className="form-control"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districtOptions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">State</label>
          <select
            className="form-control"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">All States</option>
            {stateOptions.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Clinic Type */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Clinic Type</label>
          <select
            className="form-control"
            value={clinicType}
            onChange={(e) => setClinicType(e.target.value)}
          >
            <option value="">All Types</option>
            {clinicTypeOptions.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
       <div className="col-md-3">
         <label className="form-label fw-semibold">Platform</label>
         <select
           className="form-control"
           value={platform}
           onChange={(e) => setPlatform(e.target.value)}
         >
            <option value="">All Platforms</option>
            {platformOptions.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
         </select>
       </div>

       {/* Services */}
       <div className="col-md-3">
         <label className="form-label fw-semibold">Service</label>
         <select
           className="form-control"
           value={service}
           onChange={(e) => setService(e.target.value)}
         >
            <option value="">All Services</option>
            {serviceOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
         </select>
       </div>
      {/* Buttons */}
      <div className="d-flex justify-content-end gap-3 mt-3">
        <button className="btn btn-outline-secondary" onClick={resetFilters}>
          Reset
        </button>

        <button className="btn btn-dark" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default HealthcareFilterBar;
