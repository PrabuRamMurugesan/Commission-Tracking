import React from "react";

const Step7Preferences = ({ form, onChange, onFile }) => {
  return (
    <div>
      <h4>Preferences & Verification</h4>

      <div className="row mt-3">
        <div className="col-md-6 mb-3">
          <label className="form-label">Preferred Language</label>
          <input
            type="text"
            className="form-control"
            value={form.preferredLanguage}
            onChange={(e) => onChange("preferredLanguage", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Communication Preference</label>
          <input
            type="text"
            className="form-control"
            value={form.communicationPreference}
            onChange={(e) =>
              onChange("communicationPreference", e.target.value)
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Referrer ID</label>
          <input
            type="text"
            className="form-control"
            value={form.referrerId}
            onChange={(e) => onChange("referrerId", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Upload Profile Photo</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => onFile("profilePhoto", e.target.files[0])}
          />
        </div>

        <div className="col-md-4 mt-3">
          <label className="form-label">Phone Verified</label>
          <input
            type="checkbox"
            className="form-check-input ms-2"
            checked={form.otpPhoneVerification}
            onChange={(e) => onChange("otpPhoneVerification", e.target.checked)}
          />
        </div>

        <div className="col-md-4 mt-3">
          <label className="form-label">Email Verified</label>
          <input
            type="checkbox"
            className="form-check-input ms-2"
            checked={form.emailVerified}
            onChange={(e) => onChange("emailVerified", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step7Preferences;
