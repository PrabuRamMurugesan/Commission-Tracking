import React, { useEffect, useState } from "react";
import axios from "axios";

const TerritoryHeadGSTPage = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    const res = await axios.get("/api/gst-reports?role=territory-head");
    setRecords(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = records.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
  );
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-5">
      <h3>Territory Head GST Report</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Region</th>
            <th>Source</th>
            <th>Commission (₹)</th>
            <th>GST (%)</th>
            <th>GST (₹)</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id}>
              <td>{item.region}</td>
              <td>{item.source}</td>
              <td>₹{item.commission.toFixed(2)}</td>
              <td>{item.gstRate}%</td>
              <td>₹{item.gstAmount.toFixed(2)}</td>
              <td>
                <a
                  href={`/api/invoices/generate?id=${item._id}`}
                  target="_blank"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TerritoryHeadGSTPage;
