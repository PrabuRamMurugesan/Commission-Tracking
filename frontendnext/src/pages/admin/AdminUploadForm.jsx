import React, { useState } from "react";
import ToastAlert from "../../components/crm/ToastAlert";

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
        "http://localhost:3000/api/admin/bulk-upload",
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
    <div className="d-flex flex-column justify-start align-items-center mt-5  vw-100 vh-100">
      <div className="container mt-4 d-flex flex-column align-items-center gap-3 border p-5 rounded">
        <h4>🔄 Admin Bulk Product Upload</h4>
        <input
          className="form-control my-2"
          placeholder="Grid Code (Optional)"
          value={gridCode}
          onChange={(e) => setGridCode(e.target.value)}
        />
        <input
          className="form-control my-2"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button className="btn btn-primary mt-2" onClick={handleUpload}>
          Upload CSV
        </button>

        <ToastAlert {...toast} onClose={() => setToast({ show: false })} />
      </div>
    </div>
  );
};

export default AdminUploadForm;
