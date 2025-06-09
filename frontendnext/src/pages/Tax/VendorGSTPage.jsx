import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorGSTPage = () => {
  const [gstData, setGstData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchGSTReports = async () => {
    try {
      const res = await axios.get("/api/gst-reports?vendor=true"); // assume role-based filtering
      setGstData(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const results = gstData.filter(
      (item) =>
        item.orderId.toLowerCase().includes(keyword) ||
        item.product.toLowerCase().includes(keyword) ||
        String(item.gstRate).includes(keyword)
    );
    setFiltered(results);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchGSTReports();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-3">📄 My GST Report</h3>

      <input
        className="form-control mb-3"
        placeholder="Search Order ID, Product, or Rate"
        value={search}
        onChange={handleSearch}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>GST Rate (%)</th>
            <th>GST Amount (₹)</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row) => (
            <tr key={row._id}>
              <td>{row.orderId}</td>
              <td>{row.product}</td>
              <td>{row.category}</td>
              <td>₹{row.amount.toFixed(2)}</td>
              <td>{row.gstRate}%</td>
              <td>₹{row.gstAmount.toFixed(2)}</td>
              <td>
                <a
                  href={`/api/invoices/generate?id=${row._id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length > itemsPerPage && (
        <ul className="pagination">
          {[...Array(Math.ceil(filtered.length / itemsPerPage))].map((_, i) => (
            <li
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              key={i}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VendorGSTPage;
