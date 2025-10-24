import React, { useState } from "react";
import axios from "axios";

const RotationManager = () => {
  const [gridCode, setGridCode] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [date, setDate] = useState("");

  const assignVendor = async () => {
    await axios.post("/api/admin/rotation", {
      gridCode,
      selectedVendorId: vendorId,
      date,
      manuallyOverridden: true,
    });
    alert("Vendor Assigned");
  };

  return (
    <div className="container mt-4">
      <h3>Vendor Rotation Manager</h3>
      <input
        className="form-control mt-2"
        placeholder="Grid Code"
        onChange={(e) => setGridCode(e.target.value)}
      />
      <input
        className="form-control mt-2"
        placeholder="Vendor ID"
        onChange={(e) => setVendorId(e.target.value)}
      />
      <input
        type="date"
        className="form-control mt-2"
        onChange={(e) => setDate(e.target.value)}
      />
      <button className="btn btn-success mt-3" onClick={assignVendor}>
        Assign
      </button>
    </div>
  );
};

export default RotationManager;
