import React from "react";

const BeneficiaryFilterBar = ({ filters, onChange, onReset }) => {
  return (
    <div className="card p-3">
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Search Name / Phone</label>
          <input
            type="text"
            className="form-control"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Enter name or phone"
          />
        </div>

        <div className="col-md-2 mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            value={filters.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </div>

        <div className="col-md-2 mb-3">
          <label className="form-label">State</label>
          <input
            type="text"
            className="form-control"
            value={filters.state}
            onChange={(e) => onChange("state", e.target.value)}
          />
        </div>

        <div className="col-md-2 mb-3">
          <label className="form-label">Plan Type</label>
          <input
            type="text"
            className="form-control"
            value={filters.planType}
            onChange={(e) => onChange("planType", e.target.value)}
          />
        </div>

        <div className="col-md-2 mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            <option value="">All</option>
            <option>active</option>
            <option>inactive</option>
            <option>pending</option>
          </select>
        </div>

        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-secondary w-100" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryFilterBar;
