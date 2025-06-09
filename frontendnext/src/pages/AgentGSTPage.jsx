import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentGSTPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCommissions = async () => {
    try {
      const res = await axios.get("/api/gst-reports?role=agent"); // or use JWT to detect role
      setCommissions(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const result = commissions.filter(
      (c) =>
        c.payoutId.toLowerCase().includes(keyword) ||
        c.customer.toLowerCase().includes(keyword) ||
        String(c.gstRate).includes(keyword)
    );
    setFiltered(result);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchCommissions();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-3">📊 Agent Commission GST Report</h3>

      <input
        className="form-control mb-3"
        placeholder="Search Payout ID, Customer, GST Rate"
        value={search}
        onChange={handleSearch}
      />

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Payout ID</th>
            <th>Customer</th>
            <th>Commission (₹)</th>
            <th>GST Rate (%)</th>
            <th>GST Amount (₹)</th>
            <th>Type</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((c) => (
            <tr key={c._id}>
              <td>{c.payoutId}</td>
              <td>{c.customer}</td>
              {/* <td>₹{c.commission.toFixed(2)}</td> */}
              <td>{c.gstRate}%</td>
              {/* <td>₹{c.gstAmount.toFixed(2)}</td> */}
              <td>{c.taxType}</td>
              <td>
                <a
                  href={`/api/invoices/generate?id=${c._id}`}
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
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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

export default AgentGSTPage;
