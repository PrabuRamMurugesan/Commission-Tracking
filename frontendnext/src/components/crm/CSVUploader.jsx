import React from "react";
import Papa from "papaparse";

const CSVUploader = ({ setCsvData }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="form-control"
      />
    </div>
  );
};

export default CSVUploader;
