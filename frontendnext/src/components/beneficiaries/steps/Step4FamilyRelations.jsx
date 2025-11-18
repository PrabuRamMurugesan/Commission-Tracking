import React from "react";

const Step4FamilyRelations = ({ form, onChange }) => {
  return (
    <div>
      <h4>Family & Relations</h4>
      <div className="row mt-3">
        <div className="col-md-6 mb-3">
          <label className="form-label">Relationship</label>
          <select
            className="form-control"
            value={form.relationship}
            onChange={(e) => onChange("relationship", e.target.value)}
          >
            <option value="">Select</option>
            <option>Self</option>
            <option>Spouse</option>
            <option>Parent</option>
            <option>Child</option>
            <option>Sibling</option>
            <option>Other</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Emergency Contact Name</label>
          <input
            type="text"
            className="form-control"
            value={form.emergencyContactName}
            onChange={(e) => onChange("emergencyContactName", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Emergency Contact Phone</label>
          <input
            type="text"
            className="form-control"
            value={form.emergencyContactPhone}
            onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4FamilyRelations;
