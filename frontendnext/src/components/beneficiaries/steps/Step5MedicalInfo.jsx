import React from "react";
import TagInput from "../../common/TagInput";

const Step5MedicalInfo = ({ form, onChange }) => {
  return (
    <div>
      <h4>Medical Information</h4>
      <div className="row mt-3">
        <div className="col-md-4 mb-3">
          <label className="form-label">Blood Group</label>
          <input
            type="text"
            className="form-control"
            value={form.bloodGroup}
            onChange={(e) => onChange("bloodGroup", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Disability Status</label>
          <input
            type="text"
            className="form-control"
            value={form.disabilityStatus}
            onChange={(e) => onChange("disabilityStatus", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Last Health Checkup</label>
          <input
            type="date"
            className="form-control"
            value={form.lastHealthCheckupDate}
            onChange={(e) => onChange("lastHealthCheckupDate", e.target.value)}
          />
        </div>

        <div className="col-md-12">
          <TagInput
            label="Existing Conditions"
            value={form.existingConditions}
            onChange={(val) => onChange("existingConditions", val)}
          />
        </div>

        <div className="col-md-12">
          <TagInput
            label="Allergies"
            value={form.allergies}
            onChange={(val) => onChange("allergies", val)}
          />
        </div>

        <div className="col-md-12">
          <TagInput
            label="Current Medications"
            value={form.currentMedications}
            onChange={(val) => onChange("currentMedications", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step5MedicalInfo;
