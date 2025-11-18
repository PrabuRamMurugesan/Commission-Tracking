import React from "react";

const Step6Insurance = ({ form, onChange }) => {
  return (
    <div>
      <h4>Insurance / Membership</h4>

      <div className="row mt-3">
        <div className="col-md-6 mb-3">
          <label className="form-label">Membership ID</label>
          <input
            type="text"
            className="form-control"
            value={form.membershipId}
            onChange={(e) => onChange("membershipId", e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={form.membershipStartDate}
            onChange={(e) => onChange("membershipStartDate", e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={form.membershipEndDate}
            onChange={(e) => onChange("membershipEndDate", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Plan Type</label>
          <input
            type="text"
            className="form-control"
            value={form.planType}
            onChange={(e) => onChange("planType", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Insurance Provider</label>
          <input
            type="text"
            className="form-control"
            value={form.insuranceProvider}
            onChange={(e) => onChange("insuranceProvider", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Policy Number</label>
          <input
            type="text"
            className="form-control"
            value={form.insurancePolicyNumber}
            onChange={(e) => onChange("insurancePolicyNumber", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Coverage Type</label>
          <input
            type="text"
            className="form-control"
            value={form.coverageType}
            onChange={(e) => onChange("coverageType", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Total Utilized</label>
          <input
            type="number"
            className="form-control"
            value={form.totalUtilizedAmount}
            onChange={(e) => onChange("totalUtilizedAmount", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Remaining Limit</label>
          <input
            type="number"
            className="form-control"
            value={form.remainingLimit}
            onChange={(e) => onChange("remainingLimit", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Visits Count</label>
          <input
            type="number"
            className="form-control"
            value={form.visitsCount}
            onChange={(e) => onChange("visitsCount", e.target.value)}
          />
        </div>

        <div className="col-md-8 mb-3">
          <label className="form-label">Hospital Preference</label>
          <input
            type="text"
            className="form-control"
            value={form.hospitalPreference}
            onChange={(e) => onChange("hospitalPreference", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step6Insurance;
