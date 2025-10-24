import React from "react";

const FilePreviewTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="mt-4">
      <h5>CSV Preview</h5>
      <table className="table table-striped table-bordered table-sm">
        <thead>
          <tr>
            {headers.map((head, i) => (
              <th key={i}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((col, i) => (
                <td key={i}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilePreviewTable;
