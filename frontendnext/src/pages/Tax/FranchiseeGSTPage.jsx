import React, { useEffect, useState } from "react";
import axios from "axios";

const FranchiseeGSTPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get("/api/gst-reports?role=franchisee")
      .then((res) => setData(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-5">
      <h3>Franchisee GST Report</h3>
      <input
        className="form-control mb-3"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Source</th>
            <th>Amount (₹)</th>
            <th>GST (%)</th>
            <th>GST (₹)</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row._id}>
              <td>{row.orderId}</td>
              <td>{row.source}</td>
              <td>₹{row.amount.toFixed(2)}</td>
              <td>{row.gstRate}%</td>
              <td>₹{row.gstAmount.toFixed(2)}</td>
              <td>
                <a
                  href={`/api/invoices/generate?id=${row._id}`}
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

export default FranchiseeGSTPage;
