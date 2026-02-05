import React, { useState } from "react";
import ToastAlert from "../../components/crm/ToastAlert";
import Sidebar from "../../components/Sidebar";
import { RiRefreshFill } from "react-icons/ri";
const AdminUploadForm = () => {
  const [gridCode, setGridCode] = useState("");
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setToast({
        show: true,
        message: "Please select a CSV file",
        type: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("gridCode", gridCode); // Optional, if needed in controller

    try {
      const response = await fetch(
        "/api/admin/bulk-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setToast({
          show: true,
          message: `✅ Uploaded ${result.validCount} out of ${result.totalRows} rows successfully!`,
          type: "success",
        });
      } else {
        setToast({ show: true, message: result.message, type: "danger" });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setToast({ show: true, message: err.message, type: "danger" });
    }
  };

  return (
    <div className="d-flex flex-row vh-100 vw-100">
      <Sidebar />
      <div className="d-flex flex-column justify-start align-items-center mt-5  p-5 w-100 h-100 ">
        {" "}
        <div className="container mt-4 d-flex flex-column align-items-center gap-3 border p-5 rounded">
          <h4 className="d-flex  align-items-center gap-2">
            <RiRefreshFill size={30} /> Admin Bulk Product Upload
          </h4>
          <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3 gap-3">
            <label htmlFor="" className="mb-0 text-nowrap">
              Grid Code :
            </label>
            <input
              className="form-control my-2"
              placeholder="Grid Code (Optional)"
              value={gridCode}
              onChange={(e) => setGridCode(e.target.value)}
            />
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3 gap-3">
            <input
              className="form-control my-2"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
            <button
              className="btn btn-primary mt-2 text-nowrap"
              onClick={handleUpload}
            >
              Upload CSV
            </button>
          </div>

          <ToastAlert {...toast} onClose={() => setToast({ show: false })} />
        </div>
      </div>
    </div>
  );
};

export default AdminUploadForm;
