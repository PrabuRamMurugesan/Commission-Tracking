// src/components/AgentFilterBar.jsx
import React, { useState } from "react";

const FranciseFilterBar = ({ francise, setFilteredFrancise }) => {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [zone, setZone] = useState("");

  const uniquePlatforms = [...new Set(francise.map((a) => a.platform))];
  const uniqueZones = [...new Set(francise.map((a) => a.zone).filter(Boolean))];

  const handleFilter = () => {
    let filtered = [...francise];

    if (search) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(search.toLowerCase()) ||
          agent.email.toLowerCase().includes(search.toLowerCase()) ||
          agent.phone.includes(search)
      );
    }

    if (platform) {
      filtered = filtered.filter((agent) => agent.platform === platform);
    }

    if (status) {
      filtered = filtered.filter((agent) => agent.accountStatus === status);
    }

    if (zone) {
      filtered = filtered.filter((agent) => agent.zone === zone);
    }

    setFilteredFrancise(filtered);
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

export default FranciseFilterBar;
