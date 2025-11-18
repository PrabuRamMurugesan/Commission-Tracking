import React from "react";

const Step3Address = ({ form, onChange }) => {
  return (
    <div>
      <h4>Address Details</h4>
      <div className="row mt-3">
        <div className="col-md-12 mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">State</label>
          <input
            type="text"
            className="form-control"
            value={form.state}
            onChange={(e) => onChange("state", e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Pincode</label>
          <input
            type="text"
            className="form-control"
            value={form.pincode}
            onChange={(e) => onChange("pincode", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Latitude</label>
          <input
            type="text"
            className="form-control"
            value={form.geoLocationLat}
            onChange={(e) => onChange("geoLocationLat", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Longitude</label>
          <input
            type="text"
            className="form-control"
            value={form.geoLocationLong}
            onChange={(e) => onChange("geoLocationLong", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3Address;
