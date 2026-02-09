// src/components/Agent/AgentFilterBar.jsx
import React, { useState } from "react";

const AgentFilterBar = ({ agents, setFilteredAgents }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [zone, setZone] = useState("");

  const uniqueZones = [
    ...new Set(agents.map((a) => a.zone).filter(Boolean)),
  ];

  const handleFilter = () => {
    let filtered = [...agents];

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((a) =>
        (a.name || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q) ||
        String(a.phone || "").includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter(
        (a) => (a.accountStatus || "").toLowerCase() === status
      );
    }

    if (zone) {
      filtered = filtered.filter((a) => a.zone === zone);
    }

    setFilteredAgents(filtered);
  };

  return (
    <div className="border rounded-3 mb-4 bg-white shadow-sm p-4">
      <div className="d-flex flex-row align-items-center justify-content-between gap-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search name | email | phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2">
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

        <div className="col-md-2">
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
      </div>

      <div className="col-md-5 considered  mb-2 d-flex justify-content-center w-100 mt-3">
        <button
          className="btn btn-secondary w-100"
          onClick={handleFilter}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AgentFilterBar;
