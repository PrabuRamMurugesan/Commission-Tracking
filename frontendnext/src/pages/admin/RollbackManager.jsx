import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { PiScrollFill } from "react-icons/pi";
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
    <div className="d-flex flex-row vw-100 vh-100">
      <Sidebar />
      <div className="d-flex align-items-start justify-content-start vh-100 vw-100 my-5 p-4">
        <div className="container mt-4 d-flex flex-column align-items-center gap-4 ">
          <h3 className="d-flex gap-2 align-items-center justify-content-center">
            <PiScrollFill size={30} className="text-success" />
            Rollback Manager
          </h3>
          <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3 gap-3">
            <label htmlFor="" className="text-nowrap">
              Select File :
            </label>
            <select
              className="form-control"
              onChange={(e) => setRollbackType(e.target.value)}
            >
              <option value="file">By File</option>
              <option value="sku">By SKU</option>
            </select>
          </div>
          {rollbackType === "file" ? (
            <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3 gap-3">
              <label htmlFor="" className="text-nowrap">
                File Name :
              </label>
              <input
                className="form-control"
                placeholder="File Name"
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          ) : (
            <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3 gap-3">
              <label htmlFor="" className="text-nowrap">
                Product ID :
              </label>
              <input
                className="form-control "
                placeholder="Product ID"
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
          )}
          <button className="btn btn-warning mt-3" onClick={handleRollback}>
            Rollback
          </button>
        </div>
      </div>
    </div>
  );
};

export default RollbackManager;
