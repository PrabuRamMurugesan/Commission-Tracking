import React, { useState } from "react";
import axios from "axios";

const TodayVendorViewer = () => {
  const [gridCode, setGridCode] = useState("");
  const [vendor, setVendor] = useState(null);

  const fetchVendor = async () => {
    const res = await axios.get(`/api/admin/today-vendor?gridCode=${gridCode}`);
    setVendor(res.data.vendor);
  };

  return (
    <div className="container mt-4">
      <h3>Today's Assigned Vendor</h3>
      <input
        className="form-control mt-2"
        placeholder="Grid Code"
        onChange={(e) => setGridCode(e.target.value)}
      />
      <button className="btn btn-info mt-2" onClick={fetchVendor}>
        Fetch Vendor
      </button>
      {vendor && (
        <div className="alert alert-success mt-3">Vendor: {vendor.name}</div>
      )}
    </div>
  );
};

export default TodayVendorViewer;
