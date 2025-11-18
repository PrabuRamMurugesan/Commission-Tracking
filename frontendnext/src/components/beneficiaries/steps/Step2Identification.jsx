import React from "react";

const Step2Identification = ({ form, onChange, onFile }) => {
  return (
    <div>
      <h4>Identification</h4>
      <div className="row mt-3">
        <div className="col-md-6 mb-3">
          <label className="form-label">Aadhaar Number</label>
          <input
            type="text"
            className="form-control"
            value={form.aadhaar}
            onChange={(e) => onChange("aadhaar", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Upload Aadhaar Document</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => onFile("aadhaarDocumentUrl", e.target.files[0])}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Other ID Type</label>
          <input
            type="text"
            className="form-control"
            value={form.otherIdType}
            onChange={(e) => onChange("otherIdType", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Other ID Number</label>
          <input
            type="text"
            className="form-control"
            value={form.otherIdNumber}
            onChange={(e) => onChange("otherIdNumber", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">KYC Status</label>
          <select
            className="form-control"
            value={form.kycStatus}
            onChange={(e) => onChange("kycStatus", e.target.value)}
          >
            <option>pending</option>
            <option>verified</option>
            <option>rejected</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Step2Identification;
