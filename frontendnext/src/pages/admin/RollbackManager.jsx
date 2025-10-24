import React, { useState } from "react";
import axios from "axios";

const RollbackManager = () => {
  const [rollbackType, setRollbackType] = useState("file");
  const [fileName, setFileName] = useState("");
  const [productId, setProductId] = useState("");

  const handleRollback = async () => {
    await axios.post("/api/admin/rollback", {
      rollbackType,
      fileName,
      productId,
    });
    alert("Rollback completed");
  };

  return (
    <div className="container mt-4">
      <h3>Rollback Manager</h3>
      <select
        className="form-control"
        onChange={(e) => setRollbackType(e.target.value)}
      >
        <option value="file">By File</option>
        <option value="sku">By SKU</option>
      </select>
      {rollbackType === "file" ? (
        <input
          className="form-control mt-2"
          placeholder="File Name"
          onChange={(e) => setFileName(e.target.value)}
        />
      ) : (
        <input
          className="form-control mt-2"
          placeholder="Product ID"
          onChange={(e) => setProductId(e.target.value)}
        />
      )}
      <button className="btn btn-warning mt-3" onClick={handleRollback}>
        Rollback
      </button>
    </div>
  );
};

export default RollbackManager;
