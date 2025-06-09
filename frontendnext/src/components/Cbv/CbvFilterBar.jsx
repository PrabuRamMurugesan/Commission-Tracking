// src/components/CbvFilterBar.jsx
import React, { useState } from "react";

const CbvFilterBar = ({ cbv, setFilteredCbv }) => {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [zone, setZone] = useState("");

  const uniquePlatforms = [...new Set(cbv.map((a) => a.platform))];
  const uniqueZones = [...new Set(cbv.map((a) => a.zone).filter(Boolean))];

  const handleFilter = () => {
    let filtered = [...cbv];

    if (search) {
      filtered = filtered.filter(
        (cbv) =>
          cbv.name.toLowerCase().includes(search.toLowerCase()) ||
          cbv.email.toLowerCase().includes(search.toLowerCase()) ||
          cbv.phone.includes(search)
      );
    }

    if (platform) {
      filtered = filtered.filter((cbv) => cbv.platform === platform);
    }

    if (status) {
      filtered = filtered.filter((cbv) => cbv.accountStatus === status);
    }

    if (zone) {
      filtered = filtered.filter((cbv) => cbv.zone === zone);
    }

    setFilteredCbv(filtered);
  };

  return (
    <div className="row mb-3">
      <div className="col-md-3 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search name/email/phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">All Platforms</option>
          {uniquePlatforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="">All Zones</option>
          {uniqueZones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3 mb-2">
        <button className="btn btn-secondary w-100" onClick={handleFilter}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CbvFilterBar;
