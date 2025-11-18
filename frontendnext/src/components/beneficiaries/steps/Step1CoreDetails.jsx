import React from "react";

const Step1CoreDetails = ({ form, onChange }) => {
  return (
    <div>
      <h4>Core Details</h4>
      <div className="row mt-3">
        <div className="col-md-6 mb-3">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-control"
            value={form.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Phone *</label>
          <input
            type="text"
            className="form-control"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            value={form.age}
            onChange={(e) => onChange("age", e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={form.dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-control"
            value={form.gender}
            onChange={(e) => onChange("gender", e.target.value)}
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Marital Status</label>
          <select
            className="form-control"
            value={form.maritalStatus}
            onChange={(e) => onChange("maritalStatus", e.target.value)}
          >
            <option value="">Select</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Occupation</label>
          <input
            type="text"
            className="form-control"
            value={form.occupation}
            onChange={(e) => onChange("occupation", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step1CoreDetails;
